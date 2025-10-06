import axios from 'axios'

// Derive backend base URL from env; allow empty for dev proxy fallback
const raw = (import.meta.env.VITE_BACKEND_URL || '').trim()
// Remove trailing slash (except keep protocol slashes)
const baseURL = raw ? raw.replace(/\/$/, '') : ''

if (!baseURL) {
  // Helpful hint in dev if env not configured
  // eslint-disable-next-line no-console
  console.warn('[httpClient] VITE_BACKEND_URL not set – using relative URLs (dev proxy expected).')
}

export const httpClient = axios.create({
  baseURL, // '' => relative
  withCredentials: true
})

// Simple helper so other modules can introspect the resolved base URL
export const getHttpBaseURL = () => baseURL || window.location.origin
