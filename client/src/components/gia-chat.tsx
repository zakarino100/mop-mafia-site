import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'

interface Message {
  role: 'gia' | 'user'
  text: string
}

// Collected lead data as conversation progresses
interface Lead {
  lastClean: string
  serviceType: string
  frequency: string
  address: string
  bedsBaths: string
  pets: string
  sqft: string
}

type Step =
  | 'last_clean'
  | 'service_type'
  | 'address'
  | 'confirm'
  | 'beds_baths'
  | 'pets'
  | 'value'
  | 'pricing'
  | 'sqft'
  | 'close'
  | 'done'

function inferServiceType(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('move') || t.includes('moving')) return 'move in/out clean'
  if (t.includes('deep')) return 'deep clean'
  if (t.includes('standard') || t.includes('normal') || t.includes('regular') || t.includes('basic')) return 'standard clean'
  if (t.includes('week') || t.includes('month') || t.includes('recurring')) return 'standard clean'
  // If they gave beds/baths or something we can't parse — return empty so we ask again
  return ''
}

function inferFrequency(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('week')) return 'every week'
  if (t.includes('bi') || t.includes('two week') || t.includes('every other')) return 'every two weeks'
  if (t.includes('month')) return 'monthly'
  if (t.includes('one time') || t.includes('once') || t.includes('just') || t.includes('single')) return 'one time'
  return 'one time'
}

// Try to pull beds/baths out of any message
function extractBedsBaths(text: string): string {
  const m = text.match(/(\d+)\s*(bed|bd)/i)
  const b = text.match(/(\d+)\s*(bath|ba)/i)
  if (m || b) {
    const beds = m ? m[1] : null
    const baths = b ? b[1] : null
    if (beds && baths) return `${beds} bed ${baths} bath`
    if (beds) return `${beds} bed`
    if (baths) return `${baths} bath`
  }
  return ''
}

function buildValueLine(lead: Lead): string {
  const hasPets = lead.pets.toLowerCase().includes('yes') ||
    lead.pets.toLowerCase().includes('dog') ||
    lead.pets.toLowerCase().includes('cat')
  const isLongOverdue = lead.lastClean.toLowerCase().includes('never') ||
    lead.lastClean.toLowerCase().includes('year') ||
    lead.lastClean.toLowerCase().includes('long') ||
    lead.lastClean.toLowerCase().includes('while')
  const isMoving = lead.serviceType.includes('move')
  const isRecurring = lead.frequency.includes('week') || lead.frequency.includes('month')

  if (hasPets) return 'We use products that are safe around pets, just so you know.'
  if (isMoving) return 'We do a full top to bottom so you are starting fresh, not dealing with whatever the last people left.'
  if (isLongOverdue) return 'If it has been a while we will get it back to baseline on the first visit.'
  if (isRecurring) return 'Most of our recurring clients say it really holds up between visits once we do the first deep reset.'
  return 'A lot of clients start with a deep clean then set a recurring schedule once they see how it holds up.'
}

function getNextGia(userText: string, step: Step, lead: Lead): { text: string; next: Step; updatedLead: Lead } {
  const updated = { ...lead }

  switch (step) {
    case 'last_clean':
      updated.lastClean = userText
      updated.serviceType = inferServiceType(userText)
      return {
        text: 'What kind of cleaning are you looking for, one time or more of a recurring schedule?',
        next: 'service_type',
        updatedLead: updated,
      }

    case 'service_type': {
      // Check if they gave us beds/baths instead of service type
      const bedsBathsFromServiceQ = extractBedsBaths(userText)
      if (bedsBathsFromServiceQ) updated.bedsBaths = bedsBathsFromServiceQ

      const parsedService = inferServiceType(userText)
      if (parsedService) {
        updated.serviceType = parsedService
        updated.frequency = inferFrequency(userText)
        return {
          text: 'What is the address?',
          next: 'address',
          updatedLead: updated,
        }
      }
      // Could not determine service type — ask specifically
      return {
        text: 'Are you thinking a one-time clean or a recurring schedule like weekly or monthly?',
        next: 'service_type',
        updatedLead: updated,
      }
    }

    case 'address':
      updated.address = userText
      return {
        text: `Got it. To confirm you want a ${updated.serviceType}${updated.frequency && updated.frequency !== 'one time' ? ' ' + updated.frequency : ''} for ${updated.address}.`.replace(/\s+/g, ' ').trim(),
        next: 'confirm',
        updatedLead: updated,
      }

    case 'confirm': {
      const t2 = userText.toLowerCase()
      // Did they correct the service type?
      const correctedService = inferServiceType(userText)
      if ((t2.includes('not') || t2.includes('no') || t2.includes('actually') || t2.includes('just') || t2.includes('normal') || t2.includes('standard')) && correctedService) {
        updated.serviceType = correctedService
        const nextQ = updated.bedsBaths ? 'Any pets in the home?' : 'How many beds and baths?'
        const nextStep = updated.bedsBaths ? 'pets' : 'beds_baths'
        return {
          text: `Got it, ${correctedService}. ${nextQ}`,
          next: nextStep,
          updatedLead: updated,
        }
      }
      // They confirmed or gave more info — move on
      const nextQ2 = updated.bedsBaths ? 'Any pets in the home?' : 'How many beds and baths?'
      const nextStep2 = updated.bedsBaths ? 'pets' : 'beds_baths'
      return {
        text: nextQ2,
        next: nextStep2,
        updatedLead: updated,
      }
    }

    case 'beds_baths':
      updated.bedsBaths = userText
      return {
        text: 'Any pets in the home?',
        next: 'pets',
        updatedLead: updated,
      }

    case 'pets':
      updated.pets = userText
      return {
        text: buildValueLine(updated),
        next: 'value',
        updatedLead: updated,
      }

    case 'value':
      return {
        text: `Here are 3 options for your situation:\n\nPro: Full standard clean, all rooms, surfaces, and floors.\n\nPlus: Everything in Pro plus baseboards, interior appliances, and window ledges. Most popular.\n\nUltra: Complete detail clean. Every surface, every corner. Full reset.\n\nWhat is the rough square footage so I can put the numbers together?`,
        next: 'sqft',
        updatedLead: updated,
      }

    case 'sqft':
      updated.sqft = userText
      return {
        text: 'When works for a first visit, weekday or weekend?',
        next: 'close',
        updatedLead: updated,
      }

    case 'close':
      return {
        text: 'Perfect. I will pass your info along and someone will reach out shortly to confirm.',
        next: 'done',
        updatedLead: updated,
      }

    default:
      return {
        text: 'I will have someone follow up with you shortly.',
        next: 'done',
        updatedLead: updated,
      }
  }
}

export function GiaChat() {
  const [phase, setPhase] = useState<'hidden' | 'bubble' | 'open'>('hidden')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [giaTyping, setGiaTyping] = useState(false)
  const [notifDismissed, setNotifDismissed] = useState(false)
  const [step, setStep] = useState<Step>('service_type')
  const [lead, setLead] = useState<Lead>({
    lastClean: '', serviceType: '', frequency: '',
    address: '', bedsBaths: '', pets: '', sqft: '',
  })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      if (phase === 'hidden') setPhase('bubble')
    }, 7000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase === 'bubble' && !notifDismissed) {
      const original = document.title
      let tog = false
      const id = setInterval(() => {
        document.title = tog ? original : '💬 1 new message'
        tog = !tog
      }, 1500)
      return () => { clearInterval(id); document.title = original }
    }
  }, [phase, notifDismissed])

  useEffect(() => {
    if (phase === 'open' && messages.length === 0) {
      setGiaTyping(true)
      const t = setTimeout(() => {
        setGiaTyping(false)
        setMessages([{ role: 'gia', text: "Hi, I’m Gia 👋. What kind of cleaning are you looking for?" }])
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [phase])

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
    if (!text || step === 'done') return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])

    const { text: replyText, next, updatedLead } = getNextGia(text, step, lead)
    setStep(next)
    setLead(updatedLead)

    const delay = Math.min(800 + replyText.length * 20, 3200)
    setGiaTyping(true)
    setTimeout(() => {
      setGiaTyping(false)
      setMessages(prev => [...prev, { role: 'gia', text: replyText }])
    }, delay)
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
              Hi, I’m Gia 👋. What kind of cleaning are you looking for?
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <img src="/gia-avatar.jpg" alt="Gia" className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-lg" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">1</span>
          </div>
        </div>
      )}

      {phase === 'open' && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          <div className="bg-navy px-4 py-3 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img src="/gia-avatar.jpg" alt="Gia" className="w-10 h-10 rounded-full object-cover border-2 border-gold" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-inter font-semibold text-sm">Gia</p>
              <p className="text-gold text-xs font-inter">Mop Mafia</p>
            </div>
            <button onClick={() => setPhase('bubble')} className="text-gray-300 hover:text-white transition-colors p-1"><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-end gap-2'}`}>
                {msg.role === 'gia' && <img src="/gia-avatar.jpg" alt="Gia" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />}
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

          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={step === 'done' ? 'Someone will be in touch shortly.' : 'Type a message...'}
              disabled={step === 'done'}
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-gold transition-colors font-inter disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || step === 'done'}
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
