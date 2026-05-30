import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { Nav } from './components/nav'
import { LandingPage } from './pages/landing'
import { AboutPage } from './pages/about'
import { ServicesPage } from './pages/services'
import { BookPage } from './pages/book'
import BlogPage from './pages/blog'
import { Router, Switch, Route, Link } from 'wouter'

function ScrollToTop() {
  const [location] = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

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
        <Route>
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-playfair">404 - Page Not Found</h1>
          </div>
        </Route>
      </Switch>
      {/* Mobile sticky CTA bar */}
      <div className="md:hidden mobile-sticky-cta">
        <Link href="/book">
          <a className="text-navy font-semibold text-center">✨ Get a Free Quote</a>
        </Link>
      </div>
    </Router>
  )
}
