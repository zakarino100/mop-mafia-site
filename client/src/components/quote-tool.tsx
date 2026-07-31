import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { AddressAutocomplete } from './address-autocomplete'

// ─── Validators ──────────────────────────────────────────────────────────────
function isValidEmail(email: string) {
  // Proper RFC-style check (not just @)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

function isValidPhone(phone: string) {
  // Accept: (555) 123-4567 / 555-123-4567 / 5551234567 / +1... — must be 10+ digits
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

function formatPhone(raw: string) {
  // Auto-format as (XXX) XXX-XXXX while typing
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

// ─── Field wrapper with validation indicator ──────────────────────────────────
function FieldStatus({ valid, touched, children }: { valid: boolean; touched: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      {touched && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {valid
            ? <CheckCircle size={16} className="text-green-500" />
            : <AlertCircle size={16} className="text-red-400" />}
        </span>
      )}
    </div>
  )
}

export function QuoteTool() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: 'standard',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    frequency: 'monthly',
    message: ''
  })

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const emailValid = isValidEmail(formData.email)
  const phoneValid = isValidPhone(formData.phone)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? formatPhone(value) : value
    }))
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    // Mark all fields as touched so errors show
    setTouched({ email: true, phone: true })

    if (!emailValid) {
      setSubmitError('Please enter a valid email address.')
      return
    }
    if (!phoneValid) {
      setSubmitError('Please enter a valid phone number (10 digits).')
      return
    }

    const emailSubject = `Quote Request — ${formData.name}`
    const emailBody = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Address: ${formData.address}`,
      '',
      `Service: ${formData.serviceType}`,
      `Bedrooms: ${formData.bedrooms || '—'}`,
      `Bathrooms: ${formData.bathrooms || '—'}`,
      `Sq Ft: ${formData.squareFeet || '—'}`,
      `Frequency: ${formData.frequency}`,
      '',
      `Notes: ${formData.message || '—'}`,
    ].join('\n')

    window.location.href = `mailto:contact@mop-mafia.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setTouched({})
      setFormData({
        name: '', email: '', phone: '', address: '',
        serviceType: 'standard', bedrooms: '', bathrooms: '',
        squareFeet: '', frequency: 'monthly', message: ''
      })
    }, 4000)
  }

  const inputClass = (field?: string, extra = '') =>
    `w-full px-4 py-3 border rounded-lg font-inter text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
      field && touched[field]
        ? (field === 'email' ? emailValid : phoneValid)
          ? 'border-green-400 focus:border-green-500'
          : 'border-red-400 focus:border-red-500'
        : 'border-gray-300 focus:border-gold'
    } ${extra}`

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h3 className="font-playfair text-3xl text-navy mb-3">Request Sent!</h3>
        <p className="font-inter text-gray-600 mb-2">We'll be in touch within 24 hours.</p>
        <p className="font-inter text-gray-500 text-sm">Keep an eye on your phone. Gia may reach out shortly.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter font-semibold text-navy mb-2">Full Name *</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} onBlur={() => handleBlur('name')}
                  required className={inputClass()} placeholder="Your name"
                />
              </div>
              <div>
                <label className="block font-inter font-semibold text-navy mb-2">Email *</label>
                <FieldStatus valid={emailValid} touched={!!touched.email}>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} onBlur={() => handleBlur('email')}
                    required className={`${inputClass('email')} pr-9`}
                    placeholder="you@example.com"
                  />
                </FieldStatus>
                {touched.email && !emailValid && (
                  <p className="mt-1 text-xs text-red-500 font-inter">Enter a valid email address</p>
                )}
              </div>
            </div>

            {/* Phone + Service Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter font-semibold text-navy mb-2">Phone Number *</label>
                <FieldStatus valid={phoneValid} touched={!!touched.phone}>
                  <input
                    type="tel" name="phone" value={formData.phone}
                    onChange={handleChange} onBlur={() => handleBlur('phone')}
                    required className={`${inputClass('phone')} pr-9`}
                    placeholder="(984) 123-4567"
                    maxLength={14}
                  />
                </FieldStatus>
                {touched.phone && !phoneValid && (
                  <p className="mt-1 text-xs text-red-500 font-inter">Enter a valid 10-digit phone number</p>
                )}
                {touched.phone && phoneValid && (
                  <p className="mt-1 text-xs text-green-600 font-inter">✅ Valid — Gia may text this number after submission</p>
                )}
              </div>
              <div>
                <label className="block font-inter font-semibold text-navy mb-2">Service Type *</label>
                <select
                  name="serviceType" value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter text-gray-900 focus:outline-none focus:border-gold"
                >
                  <option value="standard">Standard Clean</option>
                  <option value="deep">Deep Clean</option>
                  <option value="moveInOut">Move In / Move Out</option>
                  <option value="custom">Custom Service</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block font-inter font-semibold text-navy mb-2">Property Address *</label>
              <AddressAutocomplete
                value={formData.address}
                onChange={(val) => setFormData(prev => ({ ...prev, address: val }))}
                required
              />
            </div>

            {/* Home Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-inter font-semibold text-navy mb-2">Bedrooms</label>
                <input
                  type="number" name="bedrooms" value={formData.bedrooms}
                  onChange={handleChange} min="1" max="20"
                  className={inputClass()} placeholder="4"
                />
              </div>
              <div>
                <label className="block font-inter font-semibold text-navy mb-2">Bathrooms</label>
                <input
                  type="number" name="bathrooms" value={formData.bathrooms}
                  onChange={handleChange} min="1" max="20"
                  className={inputClass()} placeholder="3"
                />
              </div>
              <div>
                <label className="block font-inter font-semibold text-navy mb-2">Square Feet</label>
                <input
                  type="number" name="squareFeet" value={formData.squareFeet}
                  onChange={handleChange} min="500"
                  className={inputClass()} placeholder="5,000"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block font-inter font-semibold text-navy mb-2">Desired Frequency *</label>
              <select
                name="frequency" value={formData.frequency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter text-gray-900 focus:outline-none focus:border-gold"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="oneTime">One-Time</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-inter font-semibold text-navy mb-2">Additional Notes</label>
              <textarea
                name="message" value={formData.message}
                onChange={handleChange} rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gold"
                placeholder="Tell us about your home, specific concerns, or preferred schedule..."
              />
            </div>

            {/* Error */}
            {submitError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="font-inter text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gold text-navy font-playfair text-lg font-bold rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Request Your Quote
            </button>

            <p className="font-inter text-xs text-gray-400 text-center">
              By submitting, you agree to receive a text from Gia confirming your request.
            </p>
          </form>
        </div>

        {/* Contact Sidebar */}
        <div className="space-y-8">
          <div className="bg-navy text-white p-8 rounded-lg">
            <h3 className="font-playfair text-2xl mb-6 text-gold">Quick Contact</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Phone className="text-gold flex-shrink-0" size={24} />
                <div>
                  <p className="font-inter text-sm text-gray-300">Call us directly</p>
                  <a href="tel:(984)464-6019" className="font-playfair text-xl text-gold font-bold hover:opacity-80 transition-opacity">
                    (984) 464-6019
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="text-gold flex-shrink-0" size={24} />
                <div>
                  <p className="font-inter text-sm text-gray-300">Email us</p>
                  <a href="mailto:contact@mop-mafia.com" className="font-playfair text-base text-gold font-bold hover:opacity-80 transition-opacity break-all">
                    contact@mop-mafia.com
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="text-gold flex-shrink-0" size={24} />
                <div>
                  <p className="font-inter text-sm text-gray-300">Serving</p>
                  <p className="font-playfair text-base text-gold font-bold">Raleigh · Cary · Durham · Chapel Hill · Wake Forest</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cream p-8 rounded-lg border-l-4 border-gold">
            <h4 className="font-playfair text-xl text-navy font-bold mb-3">What Happens Next?</h4>
            <ol className="font-inter text-gray-700 text-sm space-y-2">
              <li className="flex gap-2"><span className="text-gold font-bold">1.</span> We review your request personally</li>
              <li className="flex gap-2"><span className="text-gold font-bold">2.</span> Gia may follow up by text to confirm details</li>
              <li className="flex gap-2"><span className="text-gold font-bold">3.</span> We send you a custom quote within 24h</li>
              <li className="flex gap-2"><span className="text-gold font-bold">4.</span> Your home. Our standard.</li>
            </ol>
          </div>

          <div className="space-y-3">
            {['Woman-Owned & Family-Operated', 'No Contractors — Just Us', 'Fully Insured & Bonded', '100+ Five-Star Reviews', 'Serving Homes Across the Triangle'].map(item => (
              <div key={item} className="flex gap-2 font-inter text-gray-700 text-sm">
                <span className="text-gold">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
