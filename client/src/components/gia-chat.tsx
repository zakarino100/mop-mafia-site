import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'

interface Message {
  role: 'gia' | 'user'
  text: string
}

interface Lead {
  lastClean: string
  serviceType: string
  frequency: string
  address: string
  bedsBaths: string
  pets: string
  sqft: number
  chosenTier: string
  chosenPrice: number
  schedulePrefs: string
}

type Step =
  | 'service_type'
  | 'address'
  | 'confirm'
  | 'beds_baths'
  | 'pets'
  | 'sqft'
  | 'pricing'
  | 'tier_chosen'
  | 'schedule'
  | 'objection'
  | 'done'

// ─── Helpers ────────────────────────────────────────────────────────────────

function inferServiceType(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('move') || t.includes('moving')) return 'move in/out clean'
  if (t.includes('deep')) return 'deep clean'
  if (t.includes('standard') || t.includes('normal') || t.includes('regular') || t.includes('basic')) return 'standard clean'
  if (t.includes('week') || t.includes('month') || t.includes('recurring')) return 'standard clean'
  return ''
}

function inferFrequency(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('every other week') || t.includes('every 2 week') || t.includes('every two week') ||
      t.includes('bi-week') || t.includes('biweek') || t.includes('bi week') ||
      t.includes('2 week') || t.includes('other week') || t.includes('two week')) return 'every two weeks'
  if (t.includes('twice a month') || t.includes('bi-monthly')) return 'twice a month'
  if (t.includes('every week') || t.includes('weekly') ||
      (t.includes('week') && !t.includes('two') && !t.includes('other') && !t.includes('2'))) return 'every week'
  if (t.includes('month')) return 'monthly'
  if (t.includes('one time') || t.includes('once') || t.includes('single') || t.includes('just once')) return 'one time'
  return 'one time'
}

function extractBedsBaths(text: string): string {
  const m = text.match(/(\d+)\s*(bed|bd)/i)
  const b = text.match(/(\d+)\s*(bath|ba\b)/i)
  if (m || b) {
    const beds = m ? m[1] : null
    const baths = b ? b[1] : null
    if (beds && baths) return `${beds} bed ${baths} bath`
    if (beds) return `${beds} bed`
    if (baths) return `${baths} bath`
  }
  return ''
}

function extractSqft(text: string): number {
  const m = text.match(/(\d[\d,]*)\s*(sq|sqft|square)/i) ||
             text.match(/about\s+(\d[\d,]*)/i) ||
             text.match(/(\d[\d,]+)/)
  if (m) return parseInt(m[1].replace(/,/g, ''), 10)
  return 0
}

// ─── Pricing engine (update rates here when Nicole confirms) ─────────────────
function buildPricing(sqft: number, serviceType: string, frequency: string) {
  const isDeep = serviceType.includes('deep') || serviceType.includes('move')
  const isRecurring = frequency.includes('week') || frequency.includes('month') || frequency.includes('twice')

  // Base per-sqft rates
  const baseRate = isDeep ? 0.09 : 0.06
  const recurringDiscount = isRecurring ? 0.85 : 1.0

  const base = Math.round(sqft * baseRate * recurringDiscount / 5) * 5 // round to $5

  const pro   = Math.max(base, 120)
  const plus  = Math.round(pro * 1.28 / 5) * 5
  const ultra = Math.round(pro * 1.60 / 5) * 5

  return { pro, plus, ultra }
}

function buildValueLine(lead: Lead): string {
  const hasPets = /yes|dog|cat|pet/i.test(lead.pets)
  const isMoving = lead.serviceType.includes('move')
  const isLongOverdue = /never|year|long|while|months/i.test(lead.lastClean)
  const isRecurring = /week|month|twice/i.test(lead.frequency)

  if (hasPets) return 'We use products that are safe around pets, just so you know.'
  if (isMoving) return 'We do a full top to bottom so you are starting fresh, not dealing with what the last people left.'
  if (isLongOverdue) return 'If it has been a while we will get it back to baseline on the first visit.'
  if (isRecurring) return 'Most recurring clients say it really holds up between visits once we do the first reset.'
  return 'A lot of clients start with a deep clean then set a recurring schedule once they see how it holds up.'
}

function buildPricingMessage(lead: Lead): string {
  const sqft = lead.sqft || 2000
  const { pro, plus, ultra } = buildPricing(sqft, lead.serviceType, lead.frequency)
  const freq = lead.frequency !== 'one time' ? ` ${lead.frequency}` : ''

  return `Here are 3 options for a ${lead.serviceType}${freq}:\n\nPro $${pro} per visit\nCovers all rooms, surfaces, and floors.\n\nPlus $${plus} per visit\nEverything in Pro plus baseboards, ceiling fans, interior appliances, and window ledges. Most popular.\n\nUltra $${ultra} per visit\nFull detail reset. Inside cabinets, vents, light fixtures, every corner. Nothing missed.\n\nWe also have a satisfaction guarantee. If anything is missed we come back and fix it at no charge.\n\nWhich one works for you?`
}

function isNegative(text: string) {
  const t = text.toLowerCase()
  return t.includes('no thanks') || t.includes('not interested') || t.includes('too expensive') ||
         t.includes('too much') || t.includes('pass') || (t.includes('no') && t.length < 15)
}

function getChosenTier(text: string, lead: Lead): { tier: string; price: number } | null {
  const t = text.toLowerCase()
  const { pro, plus, ultra } = buildPricing(lead.sqft || 2000, lead.serviceType, lead.frequency)
  if (t.includes('pro')) return { tier: 'Pro', price: pro }
  if (t.includes('plus') || t.includes('middle') || t.includes('most popular')) return { tier: 'Plus', price: plus }
  if (t.includes('ultra') || t.includes('full') || t.includes('detail')) return { tier: 'Ultra', price: ultra }
  return null
}

// ─── Main conversation logic ──────────────────────────────────────────────────

function getNextGia(
  userText: string, step: Step, lead: Lead
): { text: string; next: Step; updatedLead: Lead; autoNext?: { text: string; next: Step; updatedLead: Lead } } {
  const updated = { ...lead }

  switch (step) {
    case 'service_type': {
      const bb = extractBedsBaths(userText)
      if (bb) updated.bedsBaths = bb
      const parsed = inferServiceType(userText)
      if (parsed) {
        updated.serviceType = parsed
        updated.frequency = inferFrequency(userText)
        return { text: 'What is the address?', next: 'address', updatedLead: updated }
      }
      return { text: 'Are you thinking a one-time clean or more of a recurring schedule like every two weeks or monthly?', next: 'service_type', updatedLead: updated }
    }

    case 'address':
      updated.address = userText
      return {
        text: `Got it. To confirm you want a ${updated.serviceType}${updated.frequency !== 'one time' ? ' ' + updated.frequency : ''} for ${updated.address}.`.replace(/\s+/g, ' '),
        next: 'confirm',
        updatedLead: updated,
      }

    case 'confirm': {
      const t = userText.toLowerCase()
      const corrected = inferServiceType(userText)
      const freqCorrected = inferFrequency(userText)

      if ((t.includes('not') || t.includes('no') || t.includes('actually') || t.includes('wrong')) && corrected) {
        updated.serviceType = corrected
        if (freqCorrected) updated.frequency = freqCorrected
        const nextQ = updated.bedsBaths ? 'Any pets?' : 'How many beds and baths?'
        const nextStep: Step = updated.bedsBaths ? 'pets' : 'beds_baths'
        return { text: `Got it, ${corrected}. ${nextQ}`, next: nextStep, updatedLead: updated }
      }
      const nextQ2 = updated.bedsBaths ? 'Any pets in the home?' : 'How many beds and baths?'
      const nextStep2: Step = updated.bedsBaths ? 'pets' : 'beds_baths'
      return { text: nextQ2, next: nextStep2, updatedLead: updated }
    }

    case 'beds_baths':
      updated.bedsBaths = userText
      return { text: 'Any pets in the home?', next: 'pets', updatedLead: updated }

    case 'pets':
      updated.pets = userText
      return {
        text: buildValueLine(updated),
        next: 'sqft',
        updatedLead: updated,
        autoNext: {
          text: 'What is the rough square footage of the home?',
          next: 'sqft',
          updatedLead: updated,
        },
      }

    case 'sqft': {
      const sq = extractSqft(userText)
      updated.sqft = sq || 2000
      return {
        text: buildPricingMessage(updated),
        next: 'pricing',
        updatedLead: updated,
      }
    }

    case 'pricing': {
      // Negative response
      if (isNegative(userText)) {
        return { text: 'Totally get it. Is it a price thing or something about the service?', next: 'objection', updatedLead: updated }
      }
      const chosen = getChosenTier(userText, updated)
      if (chosen) {
        updated.chosenTier = chosen.tier
        updated.chosenPrice = chosen.price
        return {
          text: `${chosen.tier} it is at $${chosen.price} per visit. What are 2 or 3 dates and times that work for you?`,
          next: 'schedule',
          updatedLead: updated,
        }
      }
      // Could not determine tier
      return { text: 'Which one works for you, Pro, Plus, or Ultra?', next: 'pricing', updatedLead: updated }
    }

    case 'schedule':
      updated.schedulePrefs = userText
      return {
        text: `Perfect. Nicole will reach out to confirm one of those times with you. Looking forward to taking care of the home.`,
        next: 'done',
        updatedLead: updated,
      }

    case 'objection': {
      const t = userText.toLowerCase()
      if (t.includes('price') || t.includes('expensive') || t.includes('cost') || t.includes('money') || t.includes('budget')) {
        // Price objection — offer review discount
        const { pro, plus, ultra } = buildPricing(updated.sqft || 2000, updated.serviceType, updated.frequency)
        const baseP = updated.chosenTier === 'Ultra' ? ultra : updated.chosenTier === 'Pro' ? pro : plus
        const discounted = baseP - 25
        return {
          text: `If you leave us a Google review after your first clean we can take $25 off and bring it down to $${discounted}. We also guarantee the work so if anything is off we come back and fix it. Want to move forward with that?`,
          next: 'pricing',
          updatedLead: updated,
        }
      }
      // Service objection
      return {
        text: 'What is the concern? We have a satisfaction guarantee so if anything is not right we come back and fix it at no charge.',
        next: 'pricing',
        updatedLead: updated,
      }
    }

    case 'done':
      return { text: 'Already sent your info to Nicole. She will be in touch.', next: 'done', updatedLead: updated }

    default:
      return { text: 'What are 2 or 3 dates and times that work for you?', next: 'schedule', updatedLead: updated }
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function GiaChat() {
  const [phase, setPhase] = useState<'hidden' | 'bubble' | 'open'>('hidden')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [giaTyping, setGiaTyping] = useState(false)
  const [notifDismissed, setNotifDismissed] = useState(false)
  const [step, setStep] = useState<Step>('service_type')
  const [lead, setLead] = useState<Lead>({
    lastClean: '', serviceType: '', frequency: '', address: '',
    bedsBaths: '', pets: '', sqft: 0, chosenTier: '', chosenPrice: 0, schedulePrefs: '',
  })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastMessageTime = useRef<number>(Date.now())
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      const id = setInterval(() => { document.title = tog ? orig : '💬 1 new message'; tog = !tog }, 1500)
      return () => { clearInterval(id); document.title = orig }
    }
  }, [phase, notifDismissed])

  // Greeting when opened
  useEffect(() => {
    if (phase === 'open' && messages.length === 0) {
      setGiaTyping(true)
      const t = setTimeout(() => {
        setGiaTyping(false)
        setMessages([{ role: 'gia', text: "Hi, I\u2019m Gia \ud83d\udc4b. What kind of cleaning are you looking for?" }])
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [phase])

  // Auto-nudge after 90s inactivity
  useEffect(() => {
    if (phase === 'open' && (step as string) !== 'done') {
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current)
      nudgeTimer.current = setTimeout(() => {
        const elapsed = Date.now() - lastMessageTime.current
        if (elapsed >= 90000 && (step as string) !== 'done') {
          setMessages(prev => [...prev, { role: 'gia', text: 'Still there? Happy to answer any questions.' }])
        }
      }, 92000)
    }
    return () => { if (nudgeTimer.current) clearTimeout(nudgeTimer.current) }
  }, [messages, phase, step])

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, giaTyping])

  const openChat = () => {
    setNotifDismissed(true)
    setPhase('open')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const fireGiaMessage = (text: string, nextStep: Step, nextLead: Lead, delay: number) => {
    setGiaTyping(true)
    setTimeout(() => {
      setGiaTyping(false)
      setStep(nextStep)
      setLead(nextLead)
      setMessages(prev => [...prev, { role: 'gia', text }])
      lastMessageTime.current = Date.now()
    }, delay)
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text || step === 'done') return
    setInput('')
    lastMessageTime.current = Date.now()
    setMessages(prev => [...prev, { role: 'user', text }])

    const { text: replyText, next, updatedLead, autoNext } = getNextGia(text, step, lead)
    const delay = Math.min(900 + replyText.length * 18, 3200)

    fireGiaMessage(replyText, next, updatedLead, delay)

    if (autoNext) {
      const followDelay = delay + Math.min(1400 + autoNext.text.length * 18, 3500)
      setTimeout(() => fireGiaMessage(autoNext.text, autoNext.next, autoNext.updatedLead, 0), followDelay)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (phase === 'hidden') return null

  return (
    <>
      {phase === 'bubble' && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-end gap-2 cursor-pointer animate-bounce-in" onClick={openChat}>
          <div className="bg-white shadow-xl rounded-2xl rounded-br-none px-4 py-3 max-w-[230px] border border-gray-100">
            <p className="font-inter text-sm text-gray-800 leading-snug">Hi, I&rsquo;m Gia 👋. What kind of cleaning are you looking for?</p>
          </div>
          <div className="relative flex-shrink-0">
            <img src="/gia-avatar.jpg" alt="Gia" className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-lg" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">1</span>
          </div>
        </div>
      )}

      {phase === 'open' && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '490px' }}>
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
                  msg.role === 'user' ? 'bg-navy text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                }`}>{msg.text}</div>
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
              placeholder={step === 'done' ? 'Nicole will be in touch shortly.' : 'Type a message...'}
              disabled={step === 'done'}
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-gold transition-colors font-inter disabled:opacity-50"
            />
            <button onClick={sendMessage} disabled={!input.trim() || step === 'done'} className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
