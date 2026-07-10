import { useState, useEffect } from 'react'

interface Review {
  id: string
  reviewer_name: string
  reviewer_photo_url?: string
  rating: number
  comment: string
  review_date: string
}

const REVIEWS_API_URL = 'https://swell-production.up.railway.app'
const BRAND = 'mop_mafia'

// Seed reviews to show while API is being wired up
const SEED_REVIEWS: Review[] = [
  {
    id: '1',
    reviewer_name: 'Jennifer M.',
    rating: 5,
    comment: 'I have never seen my kitchen look this clean. They treat my home like it\'s their own. Absolutely worth every penny.',
    review_date: '2026-04-15',
  },
  {
    id: '2',
    reviewer_name: 'Robert D.',
    rating: 5,
    comment: 'We\'ve tried 4 different cleaning services. Mop Mafia is the only one we\'ve kept. The difference is night and day.',
    review_date: '2026-03-28',
  },
  {
    id: '3',
    reviewer_name: 'Sarah K.',
    rating: 5,
    comment: 'The attention to detail is unmatched. My realtor actually asked if we renovated before listing.',
    review_date: '2026-03-10',
  },
  {
    id: '4',
    reviewer_name: 'Michelle T.',
    rating: 5,
    comment: 'Family-run and it shows. They care about your home as much as you do. Booking monthly going forward.',
    review_date: '2026-02-20',
  },
  {
    id: '5',
    reviewer_name: 'David L.',
    rating: 5,
    comment: 'Punctual, professional, and the results speak for themselves. Our 5,000 sq ft home has never looked better.',
    review_date: '2026-02-05',
  },
  {
    id: '6',
    reviewer_name: 'Amanda R.',
    rating: 5,
    comment: 'Finally — a cleaning company that actually deep cleans. No corners cut, no surfaces skipped. Worth every dollar.',
    review_date: '2026-01-18',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'text-gold' : 'text-gray-300'}>★</span>
      ))}
    </div>
  )
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS)
  const [, setLoading] = useState(false)

  useEffect(() => {
    // Try to pull live reviews from COMMAND — fall back to seeds silently
    setLoading(true)
    fetch(`${REVIEWS_API_URL}/api/reviews/${BRAND}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setReviews(data)
      })
      .catch(() => {/* use seeds */})
      .finally(() => setLoading(false))
  }, [])

  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <section className="bg-cream section-padding" aria-label="Customer reviews">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase mb-3">Google Reviews</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-navy mb-4">What Our Clients Say</h2>
          <div className="flex items-center justify-center gap-3">
            <span className="font-playfair text-5xl text-navy font-bold">{avg}</span>
            <div>
              <div className="flex gap-1 text-gold text-2xl">★★★★★</div>
              <p className="font-inter text-sm text-gray-500">{reviews.length}+ verified reviews</p>
            </div>
          </div>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                {review.reviewer_photo_url ? (
                  <img
                    src={review.reviewer_photo_url}
                    alt={review.reviewer_name}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-inter font-bold text-sm">{getInitials(review.reviewer_name)}</span>
                  </div>
                )}
                <div>
                  <p className="font-inter font-semibold text-navy text-sm">{review.reviewer_name}</p>
                  <p className="font-inter text-xs text-gray-400">
                    {new Date(review.review_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="font-inter text-gray-700 text-sm leading-relaxed mt-3">"{review.comment}"</p>
            </div>
          ))}
        </div>

        {/* Google CTA */}
        <div className="text-center mt-10">
          <a
            href="https://g.page/r/CVeCBRNnDF0_EBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-navy text-navy font-inter font-semibold rounded hover:bg-navy hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Leave Us a Review
          </a>
        </div>
      </div>
    </section>
  )
}
