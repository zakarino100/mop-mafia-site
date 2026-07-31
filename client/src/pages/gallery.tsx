import { Link } from 'wouter'
import { Seo } from '../components/seo'

const images = [
  { src: '/gallery-exterior-01.jpg', alt: 'Large home exterior', caption: 'Home Exterior' },
  { src: '/gallery-kitchen-01.jpg', alt: 'High-end kitchen before cleaning', caption: 'Kitchen' },
  { src: '/gallery-bathroom-01.jpg', alt: 'Spa-like primary bathroom', caption: 'Primary Bath' },
  { src: '/gallery-living-01.jpg', alt: 'Luxury living room', caption: 'Living Room' },
  { src: '/gallery-foyer-01.jpg', alt: 'Grand entry foyer', caption: 'Foyer' },
  { src: '/gallery-bedroom-01.jpg', alt: 'Master bedroom suite', caption: 'Master Suite' },
  { src: '/gallery-dining-01.jpg', alt: 'Formal dining room after entertaining', caption: 'Dining Room' },
  { src: '/gallery-exterior-02.jpg', alt: 'Georgian colonial home exterior', caption: 'Georgian Home' },
  { src: '/gallery-bathroom-02.jpg', alt: 'Contemporary guest bathroom', caption: 'Guest Bath' },
  { src: '/gallery-living-02.jpg', alt: 'Modern great room with glass walls', caption: 'Great Room' },
  { src: '/gallery-wine-01.jpg', alt: 'Luxury wine cellar and tasting room', caption: 'Wine Cellar' },
  { src: '/gallery-estate-01.jpg', alt: 'Large residential property aerial view', caption: 'Large Property' },
  { src: '/gallery-mudroom-01.jpg', alt: 'Luxury mudroom and laundry', caption: 'Mudroom' },
  { src: '/gallery-gym-01.jpg', alt: 'Private home gym', caption: 'Home Gym' },
  { src: '/gallery-exterior-03.jpg', alt: 'Contemporary home at dusk', caption: 'Modern Estate' },
  { src: '/gallery-closet-01.jpg', alt: 'Walk-in designer closet', caption: 'Primary Closet' },
  { src: '/gallery-kitchen-03.jpg', alt: 'Craftsman kitchen', caption: 'Craftsman Kitchen' },
  { src: '/gallery-theater-01.jpg', alt: 'Home theater after movie night', caption: 'Home Theater' },
  { src: '/gallery-exterior-04.jpg', alt: 'Traditional home exterior', caption: 'Traditional Home' },
  { src: '/gallery-open-plan-01.jpg', alt: 'Open-plan kitchen and family room', caption: 'Open Plan' },
  { src: '/gallery-bathroom-03.jpg', alt: 'Master bathroom dual vanities', caption: 'Master Bath' },
  { src: '/gallery-office-01.jpg', alt: 'Luxury home office', caption: 'Home Office' },
  { src: '/gallery-outdoor-01.jpg', alt: 'Outdoor living and pool area', caption: 'Outdoor Living' },
  { src: '/gallery-kitchen-02.jpg', alt: 'Chef kitchen in a residential home', caption: 'Chef\'s Kitchen' },
]

export function GalleryPage() {
  return (
    <div className="w-full pt-20">
      <Seo
        title="Gallery"
        description="See the kinds of homes and rooms Mop Mafia cares for across Raleigh, Cary, Durham, Chapel Hill, and nearby areas."
        path="/gallery"
        keywords="cleaning gallery Raleigh, home cleaning photos Cary, deep cleaning results Durham"
      />
      {/* Hero */}
      <section className="bg-navy py-20 px-6 text-center">
        <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase mb-4">Our Work</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-white mb-4">Every Room. Every Detail.</h1>
        <p className="font-inter text-gray-300 text-lg max-w-2xl mx-auto">
          A look at the kinds of spaces we care for, from everyday family homes to larger properties that need a sharper eye and a steadier standard.
        </p>
      </section>

      {/* Masonry gallery */}
      <section className="bg-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
            {images.map((img, i) => (
              <div key={i} className="break-inside-avoid group relative overflow-hidden rounded-sm shadow-sm">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-inter text-sm font-semibold">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 px-6 text-center">
        <h2 className="font-playfair text-4xl text-white mb-4">Your Home Could Look Like This</h2>
        <p className="font-inter text-gray-300 mb-8">Every quote is personal. Every clean is custom.</p>
        <Link href="/book">
          <a className="inline-block px-10 py-4 bg-gold text-navy font-playfair text-lg font-bold rounded hover:opacity-90 transition-opacity">
            Request Your Custom Quote →
          </a>
        </Link>
      </section>

      <footer className="bg-navy text-white border-t border-gold/20 py-8 px-6 text-center">
        <p className="font-inter text-sm text-gray-400">© {new Date().getFullYear()} Mop Mafia. All rights reserved.</p>
      </footer>
    </div>
  )
}
