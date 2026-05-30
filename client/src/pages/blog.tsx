import { Link } from 'wouter'
import { useScrollReveal } from '../hooks/useScrollReveal'

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
    title: 'The Art of Luxury Home Cleaning: Creating a Sanctuary',
    excerpt: 'Discover how professional luxury cleaning transforms your home into a pristine sanctuary. Learn the techniques and products that set premium services apart.',
    date: 'May 28, 2026',
    tags: ['Luxury', 'Home Care', 'Cleaning Tips'],
  },
  {
    id: '2',
    title: 'Sustainable Luxury: Eco-Friendly Deep Cleaning Methods',
    excerpt: 'Explore how luxury cleaning services can protect your home and the environment simultaneously. Premium care doesn\'t have to compromise sustainability.',
    date: 'May 21, 2026',
    tags: ['Sustainability', 'Premium', 'Green Living'],
  },
  {
    id: '3',
    title: 'Maintaining Your Luxury Home Between Professional Cleanings',
    excerpt: 'Expert tips and habits from our Mop Mafia team to keep your home immaculate between professional deep cleaning sessions.',
    date: 'May 14, 2026',
    tags: ['Home Maintenance', 'Professional Tips', 'Lifestyle'],
  },
]

export default function BlogPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-navy text-cream py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Mop Mafia Journal
          </h1>
          <p className="font-inter text-lg text-cream/80 max-w-2xl">
            Insights, tips, and stories about luxury home cleaning, maintenance, and creating the sanctuary you deserve.
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
            Get a free quote from our Mop Mafia team and discover how luxury cleaning can elevate your living space.
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
          <a href="#" className="text-gold font-semibold text-sm hover:text-gold/80">
            Read More →
          </a>
        </div>
      </div>
    </article>
  )
}
