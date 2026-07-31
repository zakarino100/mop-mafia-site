import { Link } from 'wouter'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Seo } from '../components/seo'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  image?: string
}

const seedPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Keep a Home Cleaner Between Professional Visits',
    excerpt: 'Simple habits and overlooked touchpoints that help a home stay cleaner, calmer, and easier to maintain between appointments.',
    date: 'May 28, 2026',
    tags: ['Home Care', 'Cleaning Tips', 'Maintenance'],
  },
  {
    id: '2',
    title: 'Deep Cleaning Without Wasting Time or Product',
    excerpt: 'What actually matters in a deep clean, where crews waste time, and how a better process protects both your schedule and your home.',
    date: 'May 21, 2026',
    tags: ['Deep Cleaning', 'Efficiency', 'Green Living'],
  },
  {
    id: '3',
    title: 'What to Look for in a Cleaning Team You Can Trust',
    excerpt: 'The practical signs of a reliable cleaning company, from communication and consistency to how they handle details inside your home.',
    date: 'May 14, 2026',
    tags: ['Home Maintenance', 'Professional Tips', 'Hiring'],
  },
]

export default function BlogPage() {
  return (
    <div className="w-full">
      <Seo
        title="Cleaning Tips and Updates"
        description="Read Mop Mafia's home cleaning tips, practical guidance, and updates for homeowners across the Triangle."
        path="/blog"
        keywords="cleaning tips Raleigh, home maintenance blog Cary, deep cleaning advice Durham"
      />
      {/* Hero Section */}
      <section className="bg-navy text-cream py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Mop Mafia Journal
          </h1>
          <p className="font-inter text-lg text-cream/80 max-w-2xl">
            Practical tips, home care advice, and a closer look at how we think about cleaning, maintenance, and consistency.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-cream">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seedPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-navy text-cream py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl mb-6">
            Ready to Transform Your Home?
          </h2>
          <p className="font-inter text-lg text-cream/80 mb-8 max-w-2xl mx-auto">
            Get a free quote from our team and let&apos;s talk about what would make your home easier to keep up.
          </p>
          <Link href="/book">
            <a className="btn-gold inline-block">
              Get Your Free Quote
            </a>
          </Link>
        </div>
      </section>
    </div>
  )
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const ref = useScrollReveal()

  return (
    <article
      ref={ref}
      className="reveal bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold bg-gold/20 text-gold px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-playfair text-xl md:text-2xl text-navy mb-3 font-bold">
          {post.title}
        </h3>
        <p className="font-inter text-charcoal mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="font-inter text-sm text-charcoal/60">
            {post.date}
          </span>
          <span className="text-gold font-semibold text-sm">
            Full articles coming soon
          </span>
        </div>
      </div>
    </article>
  )
}
