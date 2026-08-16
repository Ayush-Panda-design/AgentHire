import { useEffect, useState } from 'react'

// Animates a number from 0 to `end` over `duration` ms once `start` is true.
export function useCountUp(end, start, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    let raf
    const t0 = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(end * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
      else setValue(end)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, end, duration])

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value)
}
