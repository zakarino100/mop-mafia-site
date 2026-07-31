import { Link } from 'wouter'
import { ShieldCheck, Users, Award, Home } from 'lucide-react'
import { Gallery } from '../components/gallery'
import { Reviews } from '../components/reviews'
import { Seo } from '../components/seo'

export function LandingPage() {
  return (
    <div className="w-full">
      <Seo
        title="Home Cleaning in Raleigh, Cary, Durham and Chapel Hill"
        description="Mop Mafia provides detail-driven home cleaning across the Triangle with a trusted in-house team, custom quotes, and no contractors."
        path="/"
        keywords="home cleaning Raleigh NC, house cleaning Cary NC, deep cleaning Durham NC, move out cleaning Chapel Hill, recurring cleaning Wake Forest, woman owned cleaning company"
      />
      {/* SECTION 1: HERO */}
      <section
        className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
        style={{
          backgroundImage: "url('/mopmafia-hero.jpg')",
          backgroundAttachment: 'scroll',
        }}
        aria-label="Hero — White-Glove Luxury Home Cleaning"
      >
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-block px-4 py-2 border border-gold/50 rounded-full mb-8">
            <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase">
              Woman-Owned · Family-Operated · 5-Star Rated
            </p>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Detail-Driven Home Cleaning for Busy Households
          </h1>
          <p className="font-inter text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Reliable, high-standard cleaning across the Triangle. The same trusted team shows up every time. No contractors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <a className="btn-gold rounded inline-block">
                Request a Custom Quote
              </a>
            </Link>
            <Link href="/about">
              <a className="btn-outline rounded inline-block">
                Learn Our Story
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST BAR */}
      <section className="bg-navy py-12 md:py-16" aria-label="Trust signals">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-gold text-4xl md:text-5xl font-playfair font-bold">100+</p>
              <p className="text-white font-inter text-sm md:text-base mt-2">Five-Star Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-gold text-4xl md:text-5xl font-playfair font-bold">♀</p>
              <p className="text-white font-inter text-sm md:text-base mt-2">Woman-Owned</p>
            </div>
            <div className="text-center">
              <p className="text-gold text-4xl md:text-5xl font-playfair font-bold">0</p>
              <p className="text-white font-inter text-sm md:text-base mt-2">Contractors. Ever.</p>
            </div>
            <div className="text-center">
              <p className="text-gold text-4xl md:text-5xl font-playfair font-bold">10+</p>
              <p className="text-white font-inter text-sm md:text-base mt-2">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: POSITIONING — image split */}
      <section className="bg-white" aria-label="Why Mop Mafia">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:min-h-screen">
          <div className="h-96 lg:h-full">
            <img
              src="/mopmafia-neighborhood.jpg"
              alt="Luxury residential neighborhood served by Mop Mafia"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="bg-navy flex items-center justify-center p-8 md:p-16">
            <div className="max-w-xl">
              <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase mb-4">
                Why Mop Mafia
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-white mb-6 leading-tight">
                A Higher Standard Without the Runaround
              </h2>
              <p className="font-inter text-gray-100 text-lg leading-relaxed mb-8">
                We built Mop Mafia for homeowners who want consistency, discretion, and real attention to detail. Whether you need recurring upkeep, a reset before guests arrive, or help getting a home move-in ready, you get the same in-house team and the same standard every time.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-block px-4 py-2 bg-gold/20 border border-gold rounded-full text-gold font-inter font-semibold text-sm">Serving Homes Across the Triangle</span>
                <span className="inline-block px-4 py-2 bg-gold/20 border border-gold rounded-full text-gold font-inter font-semibold text-sm">Fully Insured</span>
                <span className="inline-block px-4 py-2 bg-gold/20 border border-gold rounded-full text-gold font-inter font-semibold text-sm">5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SERVICES */}
      <section className="bg-cream section-padding" aria-label="Our cleaning services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase mb-4">What We Offer</p>
            <h2 className="font-playfair text-5xl text-navy">Tailored to Your Home's Needs</h2>
            <p className="font-inter text-gray-600 mt-4 max-w-2xl mx-auto">
              Every home is different. We craft a cleaning plan around yours — not a package off a shelf.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-t-4 border-navy p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-playfair text-2xl text-navy mb-3">Standard Clean</h3>
              <p className="font-inter text-gray-600 text-sm mb-6">
                Recurring maintenance that keeps your home comfortable, tidy, and guest-ready between visits.
              </p>
              <Link href="/services">
                <a className="text-gold font-inter font-semibold hover:opacity-70 transition-opacity flex items-center gap-2">
                  See What's Included →
                </a>
              </Link>
            </div>

            <div className="bg-white border-t-4 border-navy p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-playfair text-2xl text-navy mb-3">Deep Clean</h3>
              <p className="font-inter text-gray-600 text-sm mb-6">
                A top-to-bottom reset for the areas that need more time, more detail, and more attention.
              </p>
              <Link href="/services">
                <a className="text-gold font-inter font-semibold hover:opacity-70 transition-opacity flex items-center gap-2">
                  See What's Included →
                </a>
              </Link>
            </div>

            <div className="bg-white border-t-4 border-navy p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-playfair text-2xl text-navy mb-3">Move In / Move Out</h3>
              <p className="font-inter text-gray-600 text-sm mb-6">
                Thorough transition cleaning to make move-ins smoother and move-outs easier.
              </p>
              <Link href="/services">
                <a className="text-gold font-inter font-semibold hover:opacity-70 transition-opacity flex items-center gap-2">
                  See What's Included →
                </a>
              </Link>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="font-inter text-gray-500 mb-6">Every quote is custom. Fill out the form and we'll reach out personally.</p>
            <Link href="/book">
              <a className="btn-gold rounded inline-block">Request Your Custom Quote</a>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: PHOTO GALLERY */}
      <Gallery />

      {/* SECTION 6: FAMILY */}
      <section className="bg-white" aria-label="Our family story">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:min-h-screen">
          <div className="bg-navy flex items-center justify-center p-8 md:p-16 order-2 lg:order-1">
            <div className="max-w-xl">
              <h2 className="font-playfair text-5xl text-white mb-8 leading-tight">
                Family-Owned. Personally Accountable.
              </h2>
              <p className="font-inter text-gray-100 text-lg leading-relaxed mb-8">
                Mop Mafia started with one simple idea: homeowners deserve a cleaning company that takes their home personally. Our founder built the business around pride, consistency, and respect for every space we enter. Today the family is still part of the work, which means you get a team that knows the standard and stands behind it.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="inline-block px-4 py-2 bg-gold/20 border border-gold rounded-full text-gold font-inter font-semibold text-sm">Woman-Owned</span>
                <span className="inline-block px-4 py-2 bg-gold/20 border border-gold rounded-full text-gold font-inter font-semibold text-sm">Family-Operated</span>
                <span className="inline-block px-4 py-2 bg-gold/20 border border-gold rounded-full text-gold font-inter font-semibold text-sm">No Contractors</span>
              </div>
            </div>
          </div>
          <div className="h-96 lg:h-full order-1 lg:order-2">
            <img
              src="/mopmafia-family.jpg"
              alt="Mop Mafia founder and daughters — the family team"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* SECTION 7: FOYER FULL-WIDTH IMAGE BREAK */}
      <section className="relative h-96 md:h-[500px] overflow-hidden" aria-hidden="true">
        <img
          src="/mopmafia-foyer.jpg"
          alt="Cleaned home entryway"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <p className="font-playfair text-3xl md:text-4xl text-white italic">"Your home is a reflection of who you are. We treat it that way."</p>
            <p className="text-gold font-inter text-sm mt-4 tracking-widest uppercase">— Mop Mafia</p>
          </div>
        </div>
      </section>

      {/* SECTION 8: REVIEWS — live from COMMAND */}
      <Reviews />

      {/* SECTION 9: WHY CUSTOM QUOTE */}
      <section className="bg-navy section-padding" aria-label="Why we quote custom">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase mb-4">Our Approach</p>
              <h2 className="font-playfair text-4xl md:text-5xl text-white mb-6 leading-tight">
                Custom Quotes That Actually Make Sense
              </h2>
              <p className="font-inter text-gray-200 text-lg leading-relaxed">
                A condo, a busy family home, and a large property do not need the same scope of work. We quote each home individually so you get the right level of service without paying for a generic package that does not fit.
              </p>
              <p className="font-inter text-gray-300 text-lg leading-relaxed mt-4">
                Tell us a little about the home and what you need, and we will reach out personally with the next step.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Home size={28} className="text-gold" />, title: "Every Home is Unique", desc: "Square footage, surfaces, frequency — we price it right." },
                { icon: <ShieldCheck size={28} className="text-gold" />, title: "Fully Insured", desc: "Bonded and insured. Your home is always protected." },
                { icon: <Users size={28} className="text-gold" />, title: "Always Family", desc: "No strangers. The same trusted team, every visit." },
                { icon: <Award size={28} className="text-gold" />, title: "5-Star Standard", desc: "We don't leave until it's exactly right. Every time." },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 p-6 rounded-lg">
                  <div className="mb-3">{item.icon}</div>
                  <h4 className="font-playfair text-white text-lg mb-2">{item.title}</h4>
                  <p className="font-inter text-gray-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: ESTATE IMAGE BREAK */}
      <section className="relative h-64 md:h-96 overflow-hidden" aria-hidden="true">
        <img
          src="/mopmafia-estate.jpg"
          alt="Residential neighborhood in North Carolina"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </section>

      {/* SECTION 11: CTA */}
      <section className="bg-navy section-padding relative" aria-label="Request a quote">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-5xl text-white mb-4">Ready to Experience What Clean Really Looks Like?</h2>
          <p className="font-inter text-xl text-gray-200 mb-4">
            Fill out our short form and we'll reach out personally within 24 hours.
          </p>
          <p className="font-inter text-gray-400 text-sm mb-10">No one-size-fits-all packages. Just a straightforward conversation about your home.</p>
          <Link href="/book">
            <a className="inline-block px-10 py-4 bg-gold text-navy font-playfair text-lg font-bold rounded hover:opacity-90 transition-opacity">
              Request Your Custom Quote →
            </a>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy text-white border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="font-playfair text-2xl mb-2">
                <span className="text-white">Mop</span>
                <span className="text-gold ml-2">Mafia</span>
              </h3>
              <p className="font-inter text-gray-300 text-sm mb-4">
                Detail-driven home cleaning for busy households across the Triangle.
              </p>
              <p className="font-inter text-gray-400 text-xs">Woman-Owned · Family-Operated · No Contractors · North Carolina</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/"><a className="font-inter text-gray-300 hover:text-gold transition-colors">Home</a></Link>
              <Link href="/about"><a className="font-inter text-gray-300 hover:text-gold transition-colors">About</a></Link>
              <Link href="/services"><a className="font-inter text-gray-300 hover:text-gold transition-colors">Services</a></Link>
              <Link href="/book"><a className="font-inter text-gray-300 hover:text-gold transition-colors">Request a Quote</a></Link>
            </div>
            <div>
              <p className="font-inter text-sm text-gray-300 mb-2">Phone</p>
              <a href="tel:+19844646019" className="font-playfair text-lg text-gold hover:opacity-80 transition-opacity">(984) 464-6019</a>
              <p className="font-inter text-sm text-gray-300 mt-4">Service Area</p>
              <p className="font-inter text-gray-300">Raleigh · Cary · Durham · Chapel Hill · Wake Forest · NC</p>
            </div>
          </div>
          <div className="border-t border-gold/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-inter text-sm text-gray-400">
              © {new Date().getFullYear()} Mop Mafia. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="text-gold text-xs font-inter">Woman-Owned</span>
              <span className="text-gold text-xs font-inter">Family-Operated</span>
              <span className="text-gold text-xs font-inter">No Contractors</span>
              <a href="/privacy.html" className="text-gray-500 text-xs font-inter hover:text-gold">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
