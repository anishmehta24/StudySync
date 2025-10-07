# StudySync – All‑in‑One Student Collaboration Platform (MERN)

An integrated platform for students to share knowledge, collaborate in real‑time, generate AI‑assisted study material, and engage through community posts & chat.

## Core Feature Modules
1. Notes
   * Upload notes (documents & images)
   * AI‑powered note generation
   * Retrieval of stored note assets
2. Community / Posts
   * Create posts & comment threads
3. Realtime Chat
   * Direct & group conversations
   * Attachments (Cloudinary)
   * Typing indicators, unread counts, pagination
4. User & Auth
   * JWT (cookie) authentication
   * Email verification & password reset (OTP)
   * Avatar upload & profile data
5. Dashboard & UI
   * Responsive layout (Tailwind)
   * Animated landing & stats

## Monorepo Layout
```
backend/    # Express + MongoDB + Socket.IO + AI integration
frontend/   # React (Vite) SPA
```

Detailed docs:
* Backend routes & socket events: `backend/README.md`
* Frontend architecture & env: `frontend/README.md`

## Technology Stack
| Layer | Tech |
| ----- | ---- |
| Frontend | React 18, Vite, Tailwind, Socket.IO client, Axios |
| Backend | Node.js, Express 4, Socket.IO, Mongoose |
| Database | MongoDB Atlas / MongoDB |
| Auth | JWT (HTTP-only cookie) |
| File/Media | Multer + Cloudinary |
| Email | Nodemailer (SMTP) |
| AI | OpenAI / Google Generative AI (extensible) |

## Quick Start
Clone & install both packages.
```
git clone <repo>
cd StudySync

# Backend
cd backend
npm install
cp .env.example .env   # fill values
npm run dev

# Frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env   # set VITE_BACKEND_URL
npm run dev
```
Open: http://localhost:5173 (default Vite) & backend typically on :5000.

## Environment Essentials
See each sub README for full list. Minimum required:
Backend: `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, SMTP creds (for email features), AI key (for generation).
Frontend: `VITE_BACKEND_URL` (unless relying on dev proxy).

## Realtime Chat Overview
* Socket handshake authenticates via JWT cookie
* Rooms per conversation ID
* Events: `conversation:join`, `message:send`, `message:typing` etc. (Full table in backend README)

## Security & Hardening Notes
* CORS restricted via env-specified origins
* HTTP-only, SameSite=None; Secure cookies recommended in production
* Sanitization of uploads handled by Cloudinary (virus scanning not yet implemented)
* Future: rate limiting & audit logging

## Roadmap (Planned Enhancements)
* Presence indicators (online/offline)
* Message editing/deletion + reactions
* Offline caching / PWA support
* AI summarization of long chats & notes clustering
* Role-based access for moderated communities

## Contributing
1. Fork & create feature branch
2. Update/add tests if adding logic (future test harness)
3. Submit PR with clear description

## License
ISC (see package metadata) – adjust if needed for distribution.

---
Refer to module READMEs for full route & event documentation.


