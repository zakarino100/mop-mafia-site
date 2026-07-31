import { Reviews } from '../components/reviews'
import { Link } from 'wouter'
import { Seo } from '../components/seo'

export function ReviewsPage() {
  return (
    <div className="w-full pt-20">
      <Seo
        title="Reviews"
        description="See what Mop Mafia clients are saying about recurring cleaning, deep cleaning, and move-in/move-out work."
        path="/reviews"
        keywords="Mop Mafia reviews, Raleigh cleaning reviews, Cary house cleaning testimonials"
      />
      {/* Hero */}
      <section className="bg-navy py-20 px-6 text-center">
        <p className="text-gold text-sm font-inter font-semibold tracking-widest uppercase mb-4">What Clients Say</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-white mb-4">Five Stars. Every Single Time.</h1>
        <p className="font-inter text-gray-300 text-lg max-w-2xl mx-auto">
          Don't take our word for it. Here's what the families we serve have to say.
        </p>
      </section>

      {/* Live reviews from COMMAND */}
      <Reviews />

      {/* CTA */}
      <section className="bg-navy py-16 px-6 text-center">
        <h2 className="font-playfair text-4xl text-white mb-4">Ready to Experience the Difference?</h2>
        <p className="font-inter text-gray-300 mb-8">Every quote is personal. No packages off a shelf.</p>
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
