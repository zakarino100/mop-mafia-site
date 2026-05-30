import { Link } from 'wouter'

const images = [
  { src: '/mopmafia-kitchen.jpg', alt: 'Luxury kitchen professionally cleaned', caption: 'Kitchen' },
  { src: '/mopmafia-bathroom.jpg', alt: 'Luxury bathroom cleaned by Mop Mafia', caption: 'Bathroom' },
  { src: '/mopmafia-living.jpg', alt: 'Immaculate luxury living room', caption: 'Living Room' },
  { src: '/mopmafia-bedroom.jpg', alt: 'Pristine luxury master bedroom', caption: 'Master Bedroom' },
  { src: '/mopmafia-foyer.jpg', alt: 'Grand luxury home entryway', caption: 'Foyer' },
  { src: '/mopmafia-detail.jpg', alt: 'Detail cleaning of luxury surface', caption: 'Detail Work' },
  { src: '/mopmafia-neighborhood.jpg', alt: 'Luxury neighborhood we serve', caption: 'Our Service Area' },
  { src: '/mopmafia-estate.jpg', alt: 'Luxury estate home', caption: 'Estate Homes' },
]

export function GalleryPage() {
  return (
    <div className="w-full pt-20">
      {/* Hero */}
      <section className="bg-navy py-20 px-6 text-center">
        <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase mb-4">Our Work</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-white mb-4">Every Room. Every Detail.</h1>
        <p className="font-inter text-gray-300 text-lg max-w-2xl mx-auto">
          We believe a clean home speaks for itself. Here's what that looks like.
        </p>
      </section>

      {/* Masonry-style grid */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((img, i) => (
              <div key={i} className="break-inside-avoid group relative overflow-hidden rounded-sm">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

      {/* Footer */}
      <footer className="bg-navy text-white border-t border-gold/20 py-8 px-6 text-center">
        <p className="font-inter text-sm text-gray-400">© {new Date().getFullYear()} Mop Mafia. All rights reserved.</p>
      </footer>
    </div>
  )
}
