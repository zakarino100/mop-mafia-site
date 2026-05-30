import { useEffect, useRef, useState } from 'react'

// Raleigh, NC center coordinates
const RALEIGH_LAT = 35.7796
const RALEIGH_LNG = -78.6382
const SERVICE_RADIUS_MILES = 20

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string, placeData?: { lat: number; lng: number; formatted: string; inRange: boolean; distance: number }) => void
  className?: string
  placeholder?: string
  required?: boolean
}

/// <reference types="@types/google.maps" />
declare global {
  interface Window {
    initGoogleMaps?: () => void
  }
}

export function AddressAutocomplete({ value, onChange, className = '', placeholder, required }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [status, setStatus] = useState<'idle' | 'in-range' | 'out-of-range'>('idle')
  const [distance, setDistance] = useState<number | null>(null)
  const [mapsReady, setMapsReady] = useState(false)

  // Load Google Maps script once
  useEffect(() => {
    if (window.google?.maps?.places) { setMapsReady(true); return }
    if (document.getElementById('gm-script')) return

    window.initGoogleMaps = () => setMapsReady(true)

    const script = document.createElement('script')
    script.id = 'gm-script'
    const key = (import.meta as unknown as { env: Record<string, string> }).env.VITE_GOOGLE_MAPS_KEY
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  // Init autocomplete once maps is loaded
  useEffect(() => {
    if (!mapsReady || !inputRef.current || autocompleteRef.current) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry'],
    })

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current!.getPlace()
      if (!place.geometry?.location) return

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const formatted = place.formatted_address ?? ''
      const dist = haversineMiles(lat, lng, RALEIGH_LAT, RALEIGH_LNG)
      const inRange = dist <= SERVICE_RADIUS_MILES

      setDistance(dist)
      setStatus(inRange ? 'in-range' : 'out-of-range')
      onChange(formatted, { lat, lng, formatted, inRange, distance: dist })
    })
  }, [mapsReady])

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus('idle')
    setDistance(null)
    onChange(e.target.value)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleManualChange}
        placeholder={placeholder ?? '123 Luxury Lane, Raleigh, NC'}
        required={required}
        className={`w-full px-4 py-3 border rounded-lg font-inter focus:outline-none text-gray-900 transition-colors ${
          status === 'in-range'
            ? 'border-green-400 focus:border-green-500'
            : status === 'out-of-range'
            ? 'border-amber-400 focus:border-amber-500'
            : 'border-gray-300 focus:border-gold'
        } ${className}`}
      />
      {status === 'in-range' && (
        <p className="mt-1.5 text-sm font-inter text-green-600 flex items-center gap-1">
          ✅ Great — you're in our service area ({distance?.toFixed(1)} mi from Raleigh)
        </p>
      )}
      {status === 'out-of-range' && distance !== null && (
        <p className="mt-1.5 text-sm font-inter text-amber-600 flex items-center gap-1">
          ⚠️ You may be outside our usual range ({distance.toFixed(1)} mi from Raleigh) — but go ahead and submit. We'll check with our team and reach out.
        </p>
      )}
    </div>
  )
}
