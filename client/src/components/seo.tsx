import { useEffect } from 'react'

type SeoProps = {
  title: string
  description: string
  path?: string
  keywords?: string
}

const SITE_NAME = 'Mop Mafia'
const SITE_URL = 'https://mop-mafia.com'
const DEFAULT_IMAGE = `${SITE_URL}/mopmafia-hero.jpg`

function upsertMeta(selector: string, attr: 'name' | 'property', value: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, value)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function Seo({ title, description, path = '/', keywords }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`
    const canonicalUrl = new URL(path, SITE_URL).toString()

    document.title = fullTitle

    upsertMeta('meta[name="description"]', 'name', 'description', description)
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', DEFAULT_IMAGE)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_IMAGE)

    if (keywords) {
      upsertMeta('meta[name="keywords"]', 'name', 'keywords', keywords)
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [title, description, path, keywords])

  return null
}
