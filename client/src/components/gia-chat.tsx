import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'

interface Message {
  role: 'gia' | 'user'
  text: string
}

type ApiMessage = { role: 'user' | 'assistant'; content: string }

const OPENER = "Hi, I\u2019m Gia \ud83d\udc4b. What kind of cleaning are you looking for?"

function playGiaSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const playTone = (freq: number, delay: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      gain.gain.setValueAtTime(0, ctx.currentTime + delay)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.5)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.55)
    }
    playTone(880, 0)
    playTone(1100, 0.13)
  } catch {}
}

export function GiaChat() {
  const [phase, setPhase] = useState<'hidden' | 'bubble' | 'open'>('hidden')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [notifDismissed, setNotifDismissed] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivity = useRef(Date.now())
  const nudgeCount = useRef(0)

  // History for Claude (alternating user/assistant)
  const apiHistory = useRef<ApiMessage[]>([])

  // Show bubble after 7s
  useEffect(() => {
    const t = setTimeout(() => { if (phase === 'hidden') setPhase('bubble') }, 7000)
    return () => clearTimeout(t)
  }, [])

  // Tab title blink
  useEffect(() => {
    if (phase === 'bubble' && !notifDismissed) {
      const orig = document.title
      let tog = false
      const id = setInterval(() => { document.title = tog ? orig : '\ud83d\udcac 1 new message'; tog = !tog }, 1500)
      return () => { clearInterval(id); document.title = orig }
    }
  }, [phase, notifDismissed])

  // Greeting when opened
  useEffect(() => {
    if (phase === 'open' && messages.length === 0) {
      setMessages([{ role: 'gia', text: OPENER }])
      apiHistory.current = [{ role: 'assistant', content: OPENER }]
      playGiaSound()
    }
  }, [phase])

  // Auto-nudge after 90s silence
  useEffect(() => {
    if (phase !== 'open' || messages.length === 0) return
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current)
    nudgeTimer.current = setTimeout(() => {
      const elapsed = Date.now() - lastActivity.current
      if (elapsed >= 90000 && nudgeCount.current < 2) {
        const nudge = 'Still there? Happy to answer any questions.'
        setMessages(prev => [...prev, { role: 'gia', text: nudge }])
        apiHistory.current.push({ role: 'assistant', content: nudge })
        nudgeCount.current += 1
        playGiaSound()
      }
    }, 92000)
    return () => { if (nudgeTimer.current) clearTimeout(nudgeTimer.current) }
  }, [messages, phase])

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const openChat = () => {
    setNotifDismissed(true)
    setPhase('open')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    lastActivity.current = Date.now()

    // Add user message
    const userMsg: Message = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    apiHistory.current.push({ role: 'user', content: text })
    nudgeCount.current = 0 // reset nudge count when user replies

    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory.current }),
      })
      const data = await res.json()
      const reply: string = data.text || 'One sec...'
      const delayMs: number = data.delayMs || 0

      // Hold typing indicator for delayMs (e.g. ~20s on price reveal)
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }

      setMessages(prev => [...prev, { role: 'gia', text: reply }])
      apiHistory.current.push({ role: 'assistant', content: reply })
      lastActivity.current = Date.now()
      playGiaSound()
    } catch {
      const err = 'Having trouble connecting. Give me one second.'
      setMessages(prev => [...prev, { role: 'gia', text: err }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (phase === 'hidden') return null

  return (
    <>
      {phase === 'bubble' && (
        <div
          className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-end gap-2 cursor-pointer animate-bounce-in"
          onClick={openChat}
        >
          <div className="bg-white shadow-xl rounded-2xl rounded-br-none px-4 py-3 max-w-[230px] border border-gray-100">
            <p className="font-inter text-sm text-gray-800 leading-snug">
              Hi, I&rsquo;m Gia 👋. What kind of cleaning are you looking for?
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <img src="/gia-avatar.jpg" alt="Gia" className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-lg" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">1</span>
          </div>
        </div>
      )}

      {phase === 'open' && (
        <div
          className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '490px' }}
        >
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img src="/gia-avatar.jpg" alt="Gia" className="w-10 h-10 rounded-full object-cover border-2 border-gold" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-inter font-semibold text-sm">Gia</p>
              <p className="text-gold text-xs font-inter">Mop Mafia</p>
            </div>
            <button onClick={() => setPhase('bubble')} className="text-gray-300 hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-end gap-2'}`}>
                {msg.role === 'gia' && (
                  <img src="/gia-avatar.jpg" alt="Gia" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                )}
                <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm font-inter leading-snug whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-navy text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <img src="/gia-avatar.jpg" alt="Gia" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              disabled={loading}
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-gold transition-colors font-inter disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
