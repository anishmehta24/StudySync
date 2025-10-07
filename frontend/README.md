# StudySync Frontend

React (Vite) single page application for the StudySync platform: notes, AI generation, community posts, realtime chat, user profiles & avatars.

## Tech Stack
* React 18 + Vite
* React Router DOM 6
* Tailwind CSS + custom theme utilities
* Socket.IO client (chat)
* Axios (centralized in `src/api/httpClient.js`)
* React Toastify (notifications)
* Framer Motion / GSAP (animations in landing/dashboard)

## Environment Variables (`.env` in `frontend/`)
Create `.env` (do not commit secrets):
```
VITE_BACKEND_URL=https://api.your-domain.com
# Optional dedicated socket endpoint (falls back to BACKEND_URL if unset)
# VITE_SOCKET_URL=https://realtime.your-domain.com
```

If `VITE_BACKEND_URL` is omitted in development, relative paths + Vite proxy (if configured) will be used.

## Installation & Scripts
```
npm install
npm run dev        # local development
npm run build      # production build -> dist/
npm run preview    # serve built bundle
```

## Source Structure
```
src/
  api/            # httpClient + feature APIs
  components/     # UI components (chat, notes, posts, layout)
  context/        # AppContext (auth/user), SocketContext (realtime)
  assets/         # Static assets
  theme.js        # Tailwind / theme helpers
  main.jsx        # Entry (Router & Providers)
```

## Auth Flow
1. On mount `AppContext` calls `/api/auth/is-auth` using `httpClient`.
2. If success, `getUserData` fetches `/api/user/data` (includes avatar URL, unread counts fetched separately in chat list).
3. Protected components rely on `isLoggedin` flag.

## Chat Client Logic
* `SocketContext` establishes a socket using `VITE_SOCKET_URL || VITE_BACKEND_URL || window.location.origin`.
* `Chat.jsx` loads conversations -> joins each room for message/unread updates.
* `ChatWindow.jsx` paginates messages (infinite scroll) and sends via socket or REST fallback for attachments.
* Typing indicators: debounced emission via `message:typing` events.

## APIs Consumed (See backend README for details)
All requests go through `httpClient` using relative paths: `/api/...`.

## Styling
Tailwind CSS with some gradient backgrounds and utility classes; custom theme colors defined in `tailwind.config.js`.

## Production Deployment Tips
* Ensure backend CORS allows the deployed frontend origin and `credentials: true`.
* Set cookies with `SameSite=None; Secure` when using different domains.
* Provide correct `VITE_BACKEND_URL` during build: `VITE_BACKEND_URL=https://api.example.com npm run build`.
* If using a reverse proxy, route `/socket.io` to the same backend that serves REST for cookie continuity.

## Extensibility Ideas
* Add offline caching for notes (Workbox / service worker).
* Theme switch (light/dark) persisted in localStorage.
* PWA manifest + install prompt.
* Chat message reactions & quoting.

---
Maintained by StudySync Frontend Team.
