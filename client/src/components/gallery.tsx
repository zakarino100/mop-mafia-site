export function Gallery() {
  const images = [
    { src: '/mopmafia-kitchen.jpg', alt: 'Kitchen professionally cleaned by Mop Mafia' },
    { src: '/mopmafia-bathroom.jpg', alt: 'Bathroom cleaned by Mop Mafia' },
    { src: '/mopmafia-living.jpg', alt: 'Freshly cleaned living room' },
    { src: '/mopmafia-bedroom.jpg', alt: 'Freshly cleaned primary bedroom' },
    { src: '/mopmafia-foyer.jpg', alt: 'Home entryway cleaned by Mop Mafia' },
    { src: '/mopmafia-detail.jpg', alt: 'Detail cleaning on a home surface' },
  ]

  return (
    <section className="bg-white" aria-label="Gallery of our work">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase mb-3">Our Work</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-navy">Every Room. Every Detail.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-sm ${i === 0 ? 'col-span-2 md:col-span-1 md:row-span-2' : ''}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-700"
                style={i === 0 ? { height: '100%', minHeight: '200px' } : {}}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
