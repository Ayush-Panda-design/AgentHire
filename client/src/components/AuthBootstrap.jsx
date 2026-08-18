import { useEffect } from 'react'
import useAuthStore from '../stores/useAuthStore'

/**
 * Hydrates auth state from cookies once at app startup and re-validates
 * silently when the user returns to this tab (e.g. after switching away).
 */
export default function AuthBootstrap({ children }) {
  const fetchMe = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMe({ silent: true })
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [fetchMe])

  return children
}
