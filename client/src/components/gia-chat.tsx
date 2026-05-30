import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'

// Conversation steps — Gia moves through these in order
type Step = 'last_clean' | 'confirm' | 'beds_baths' | 'pets' | 'value' | 'close' | 'done'

interface Message {
  role: 'gia' | 'user'
  text: string
}

interface ConvoState {
  step: Step
  lastClean: string
  bedsBaths: string
  pets: string
}

function getGiaReply(userText: string, state: ConvoState): { text: string; next: Step } {
  const t = userText.toLowerCase()

  switch (state.step) {
    case 'last_clean':
      // They answered how long since last clean — confirm and ask beds/baths
      return {
        text: `Got it. How many beds and baths?`,
        next: 'beds_baths',
      }

    case 'beds_baths':
      // Got beds/baths — ask about pets
      return {
        text: 'Any pets in the home?',
        next: 'pets',
      }

    case 'pets': {
      // Got pets info — build relevant value based on what we know
      const hasPets = t.includes('yes') || t.includes('dog') || t.includes('cat') || t.includes('pet')
      const valueText = hasPets
        ? 'We use products that are safe around pets, just so you know.'
        : state.lastClean.includes('never') || state.lastClean.includes('long') || state.lastClean.includes('year')
          ? 'If it has been a while we will get it back to baseline on the first visit.'
          : 'A lot of clients start with a deep clean and then set a recurring schedule once they see how it holds up.'
      return {
        text: valueText,
        next: 'value',
      }
    }

    case 'value':
      // Present 3-tier pricing
      return {
        text: `Here are 3 options based on what you described:\n\nPro: Full standard clean, all rooms, surfaces, and floors. Best for homes that are maintained.\n\nPlus: Everything in Pro plus baseboards, interior appliances, and window ledges. Our most popular.\n\nUltra: Complete detail clean, every surface, every corner, products upgraded for a deep reset.\n\nI can put exact numbers together once I know your square footage. What is the rough size of the home?`,
        next: 'close',
      }

    case 'close':
      return {
        text: 'When works for a first visit, weekday or weekend?',
        next: 'done',
      }

    case 'done':
      return {
        text: 'Perfect. I will send your info over and someone will confirm the details with you shortly.',
        next: 'done',
      }

    default:
      return { text: 'When works for a first visit, weekday or weekend?', next: 'done' }
  }
}

export function GiaChat() {
  const [phase, setPhase] = useState<'hidden' | 'bubble' | 'open'>('hidden')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [giaTyping, setGiaTyping] = useState(false)
  const [notifDismissed, setNotifDismissed] = useState(false)
  const [convo, setConvo] = useState<ConvoState>({
    step: 'last_clean',
    lastClean: '',
    bedsBaths: '',
    pets: '',
  })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Show notification bubble after 7s
  useEffect(() => {
    const t = setTimeout(() => {
      if (phase === 'hidden') setPhase('bubble')
    }, 7000)
    return () => clearTimeout(t)
  }, [])

  // Tab title blink when minimized
  useEffect(() => {
    if (phase === 'bubble' && !notifDismissed) {
      const original = document.title
      let toggled = false
      const interval = setInterval(() => {
        document.title = toggled ? original : '💬 1 new message'
        toggled = !toggled
      }, 1500)
      return () => { clearInterval(interval); document.title = original }
    }
  }, [phase, notifDismissed])

  // Play greeting when chat opens
  useEffect(() => {
    if (phase === 'open' && messages.length === 0) {
      setGiaTyping(true)
      const delay = 1200
      const t = setTimeout(() => {
        setGiaTyping(false)
        setMessages([{ role: 'gia', text: 'When was the last time your home had a professional clean?' }])
      }, delay)
      return () => clearTimeout(t)
    }
  }, [phase])

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, giaTyping])

  const openChat = () => {
    setNotifDismissed(true)
    setPhase('open')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    setInput('')

    const userMsg: Message = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])

    // Update convo state based on current step
    const updatedConvo = { ...convo }
    if (convo.step === 'last_clean') updatedConvo.lastClean = text
    if (convo.step === 'beds_baths') updatedConvo.bedsBaths = text
    if (convo.step === 'pets') updatedConvo.pets = text

    const { text: replyText, next } = getGiaReply(text, updatedConvo)
    updatedConvo.step = next
    setConvo(updatedConvo)

    // Typing delay proportional to reply length
    const typingMs = Math.min(600 + replyText.length * 18, 3000)
    setGiaTyping(true)
    setTimeout(() => {
      setGiaTyping(false)
      setMessages(prev => [...prev, { role: 'gia', text: replyText }])
    }, typingMs)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (phase === 'hidden') return null

  return (
    <>
      {/* Notification bubble */}
      {phase === 'bubble' && (
        <div
          className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-end gap-2 cursor-pointer animate-bounce-in"
          onClick={openChat}
          aria-label="Chat with Gia"
        >
          <div className="bg-white shadow-xl rounded-2xl rounded-br-none px-4 py-3 max-w-[230px] border border-gray-100">
            <p className="font-inter text-sm text-gray-800 leading-snug">
              When was the last time your home had a professional clean?
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <img
              src="/gia-avatar.jpg"
              alt="Gia from Mop Mafia"
              className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-lg"
            />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
              1
            </span>
          </div>
        </div>
      )}

      {/* Chat window */}
      {phase === 'open' && (
        <div
          className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '480px' }}
        >
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src="/gia-avatar.jpg"
                alt="Gia"
                className="w-10 h-10 rounded-full object-cover border-2 border-gold"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-inter font-semibold text-sm">Gia</p>
              <p className="text-gold text-xs font-inter">Mop Mafia</p>
            </div>
            <button
              onClick={() => setPhase('bubble')}
              className="text-gray-300 hover:text-white transition-colors p-1"
              aria-label="Minimize"
            >
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

            {giaTyping && (
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
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-gold transition-colors font-inter"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
