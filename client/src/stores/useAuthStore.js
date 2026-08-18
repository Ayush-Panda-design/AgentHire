import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  /** Ask the backend who the current cookie-authenticated user is. */
  fetchMe: async ({ silent = false } = {}) => {
    if (!silent) set({ isLoading: true })
    try {
      let res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      })

      // Access token expired but refresh cookie may still be valid
      if (res.status === 401) {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })
        if (refreshRes.ok) {
          res = await fetch(`${API_URL}/auth/me`, {
            credentials: 'include',
          })
        }
      }

      if (!res.ok) {
        set({ user: null, isLoading: false })
        return
      }
      const data = await res.json()
      set({ user: data.user, isLoading: false })
    } catch (err) {
      set({ user: null, isLoading: false })
    }
  },

  /** Real email/password login against /api/auth/login. */
  login: async ({ email, password }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await parseJsonSafe(res)
    if (!res.ok) {
      throw new Error(data?.error || 'Login failed')
    }
    set({ user: data.user, isLoading: false })
    return data.user
  },

  /** Real registration against /api/auth/register. */
  register: async ({ name, email, password }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    })
    const data = await parseJsonSafe(res)
    if (!res.ok) {
      throw new Error(data?.error || 'Registration failed')
    }
    set({ user: data.user, isLoading: false })
    return data.user
  },

  logout: async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      set({ user: null })
    }
  },
}))

export default useAuthStore
