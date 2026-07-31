import { useEffect } from 'react'
import { useLocation, Link } from 'wouter'
import { Nav } from './components/nav'
import { GiaChat } from './components/gia-chat'
import { LandingPage } from './pages/landing'
import { AboutPage } from './pages/about'
import { ServicesPage } from './pages/services'
import { BookPage } from './pages/book'
import BlogPage from './pages/blog'
import { GalleryPage } from './pages/gallery'
import { ReviewsPage } from './pages/reviews-page'
import { Router, Switch, Route } from 'wouter'

function ScrollToTop() {
  const [location] = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location])
  return null
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Nav />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/book" component={BookPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/reviews" component={ReviewsPage} />
        <Route>
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-playfair">404 - Page Not Found</h1>
          </div>
        </Route>
      </Switch>

      {/* Gia chat widget — appears on all pages after 7s */}
      <GiaChat />

      {/* Mobile sticky CTA */}
      <div className="md:hidden mobile-sticky-cta">
        <Link href="/book">
          <a className="text-navy font-playfair font-bold text-lg w-full text-center block">
            Get a Free Quote
          </a>
        </Link>
      </div>
    </Router>
  )
}
