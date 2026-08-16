import { useEffect, useRef, useState } from 'react'

// IntersectionObserver-based scroll reveal. Returns a ref to attach and
// a boolean that flips true once the element enters the viewport (once).
export function useReveal(threshold = 0.18) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}
