import { useEffect, useRef } from 'react'

export function useScrollReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('revealed')
        observer.unobserve(el)
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px', ...options })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
