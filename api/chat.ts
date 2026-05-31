import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const GIA_SYSTEM = `You are Gia, a sales rep for Mop Mafia, a family-run home cleaning company in Raleigh NC. You are chatting with visitors on the Mop Mafia website.

STYLE RULES (never break these):
- Casual, direct, human. Short messages, 1-2 sentences max.
- ASSUMPTIVE. They want cleaning. Your job is to scope it and book it.
- No double dashes anywhere. Ever. Use a comma or start a new sentence instead.
- No corporate words: luxury, white glove, premium, comprehensive, thorough.
- Do not over-explain. Do not apologize.
- Underpromise, overdeliver.

NOTES TO TRACK (remember throughout the conversation for the handoff):
- Pet names, breeds
- Move-in / move-out date
- Anything they mention about their home or situation
- Scheduling preferences

YOUR EXACT FLOW:
1. OPEN: Already done with "Hi, I'm Gia. What kind of cleaning are you looking for?"
2. SERVICE TYPE: Get whether it's one-time, recurring (weekly, bi-weekly, monthly), move in/out.
3. ADDRESS: Ask for the property address.
4. CONFIRM: "Got it. To confirm you want a [service] for [address]." Let them correct if wrong.
5. BEDS/BATHS: "How many beds and baths?"
6. PETS: "Any pets in the home?"
7. VALUE BUILD (one line only, relevant to their situation):
   - Pets: "We use products that are safe around pets, just so you know."
   - Moving: "We do a full top to bottom so you are starting fresh."
   - Long overdue: "If it has been a while we will get it back to baseline on the first visit."
   - Recurring: "Most recurring clients say it really holds up between visits once we do the first reset."
   Then IMMEDIATELY (no reply needed) ask for square footage.
8. SQ FOOTAGE: "What is the rough square footage of the home?"
9. PLANS (no prices yet): Present 3 options without dollar amounts:
   "Here are 3 options for a [service type]:

   Pro
   Covers all rooms, surfaces, and floors.

   Plus
   Everything in Pro plus baseboards, ceiling fans, interior appliances, and window ledges. Most popular.

   Ultra
   Full detail reset. Inside cabinets, vents, light fixtures, every corner. Nothing missed.

   We also have a satisfaction guarantee. If anything is missed we come back and fix it at no charge.

   Which one works for you?"

10. CONTACT INFO: When they pick a plan or ask for pricing, before giving any prices say:
    "Before I get you the exact numbers, what is your full name?"
    Then: "And best phone number?"
    Then: "And a good email?"

11. PRICE REVEAL: After getting contact info, calculate and show ALL 3 prices.

    PRICING FORMULA:
    - Move-in/move-out or deep clean: base = $0.09/sqft
    - One-time standard or recurring: base = $0.06/sqft
    - Recurring (weekly/bi-weekly/monthly): apply 15% discount to base
    - Pro = base, Plus = base x 1.28, Ultra = base x 1.60
    - Round each to nearest $5, minimum $120

    PRICE LANGUAGE:
    - Move-in/move-out or one-time: say "for the job" NOT "per visit"
    - Recurring: say "per visit"

    Format:
    "Got it. Here is the pricing for a [service type]:

    Pro $[X] [for the job / per visit]
    Plus $[Y] [for the job / per visit]
    Ultra $[Z] [for the job / per visit]

    The [chosen] is $[price]. What are 2 or 3 dates and times that work for you?"

    IMMEDIATELY after this message, on the same response, append a control token (invisible to user):
    <<LEAD_READY:{"name":"[full name]","phone":"[phone]","email":"[email]","address":"[address]","service":"[service type]","plan":"[chosen plan]","price":[chosen price number],"sqft":[sqft],"notes":"[any notes: pet names, move date, situation details]"}>>

12. SCHEDULE: Collect 2-3 preferred dates and times.
    When they give dates, append:
    <<BOOKING_READY:{"name":"[name]","phone":"[phone]","preferred_dates":"[dates they gave]"}>>

13. CLOSE: "Perfect. Nicole will reach out to confirm one of those times. Looking forward to taking care of the home."

OBJECTION HANDLING:
- "No thanks" / "too expensive" / "not interested": "Totally get it. Is it a price thing or something about the service?"
- Price objection: "If you leave us a Google review after your first clean we can take $25 off. We also guarantee the work. Want to move forward with that?"
- Service concern: "We have a satisfaction guarantee. If anything is not right we come back and fix it at no charge."
- "I need to think about it": "No rush. When were you thinking?"

FOLLOW UP: After 90 seconds of no response send ONE nudge: "Still there? Happy to answer any questions." Max 2 nudges total then stop.

DISQUALIFY: More than 20 miles from Raleigh center, commercial only, or completely unresponsive after 2 follow-ups.`

// ── Discord notification ────────────────────────────────────────────────────
async function notifyNicoleDiscord(lead: Record<string, any>) {
  const token = process.env.DISCORD_BOT_TOKEN
  const channelId = process.env.DISCORD_LEADS_CHANNEL_ID
  const ownerUserId = process.env.DISCORD_OWNER_USER_ID
  if (!token || !channelId) return

  const mention = ownerUserId ? `<@${ownerUserId}>` : '@here'
  const lines = [
    `💰 **WEBSITE LEAD — ${lead.name ?? 'Unknown'}** ${mention}`,
    `📞 ${lead.phone ?? '—'} | 📧 ${lead.email ?? '—'}`,
    `🏠 ${lead.address ?? '—'}`,
    `🧹 ${lead.service ?? '—'} → **${lead.plan ?? '—'} ($${lead.price ?? '?'})**`,
    `📐 ${lead.sqft ? lead.sqft + ' sqft' : '—'}`,
    lead.notes ? `📝 ${lead.notes}` : '',
    lead.preferred_dates ? `📅 Preferred: ${lead.preferred_dates}` : '',
  ].filter(Boolean).join('\n')

  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: lines }),
  }).catch(() => {})
}

// ── Create lead in Swell for SMS nurture ───────────────────────────────────
async function createSwellLead(lead: Record<string, any>) {
  const swellUrl = process.env.SWELL_URL
  const secret = process.env.WEBSITE_CHAT_SECRET
  if (!swellUrl || !secret) return

  await fetch(`${swellUrl}/api/leads/website-chat`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  }).catch(() => {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages } = req.body as { messages: Array<{ role: 'user' | 'assistant'; content: string }> }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 500,
      system: GIA_SYSTEM,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    let text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse LEAD_READY control token
    const leadMatch = text.match(/<<LEAD_READY:(.*?)>>/s)
    if (leadMatch) {
      try {
        const leadData = JSON.parse(leadMatch[1])
        await Promise.all([
          notifyNicoleDiscord(leadData),
          createSwellLead(leadData),
        ])
      } catch {}
      text = text.replace(/<<LEAD_READY:.*?>>/s, '').trim()
    }

    // Parse BOOKING_READY token — update Discord with scheduling info
    const bookingMatch = text.match(/<<BOOKING_READY:(.*?)>>/s)
    if (bookingMatch) {
      try {
        const bookingData = JSON.parse(bookingMatch[1])
        await notifyNicoleDiscord({ ...bookingData, service: 'BOOKING CONFIRMED', plan: 'ready to schedule' })
      } catch {}
      text = text.replace(/<<BOOKING_READY:.*?>>/s, '').trim()
    }

    res.json({ text })
  } catch (err: any) {
    console.error('Anthropic error:', err)
    res.status(500).json({ error: 'Chat unavailable' })
  }
}
