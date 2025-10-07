# StudySync Backend

Node/Express + MongoDB backend powering authentication, user profiles (avatars), AI assisted notes, community posts, and real‑time chat (Socket.IO).

## Tech Stack
* Express 4
* MongoDB / Mongoose
* JWT (HTTP only cookie) auth
* Socket.IO (real‑time chat)
* Multer + Cloudinary (file & avatar uploads)
* Nodemailer (OTP & verification emails)
* OpenAI / Google Generative AI (note generation)

## Environment Variables (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=supersecret
CLIENT_URL=https://your-frontend.example.com

# CORS origins (up to 3 supported currently)
CORS_ORIGIN_1=https://your-frontend.example.com
CORS_ORIGIN_2=
CORS_ORIGIN_3=

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=no-reply@studysync.example

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI (optional – one provider enough)
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_KEY=
```

## Install & Run
```
npm install
npm run dev   # with nodemon & dotenv
```

## Conventions
* All JSON responses shape: `{ success: boolean, message?, ...data }`.
* Authenticated routes require cookie `token` (JWT) – set after login/register.
* Pagination (chat messages) uses `?page=<n>&limit=<m>` (1-based).

## REST API Reference

Base prefix: `/api`

### Auth (`/api/auth`)
| Method | Path | Body | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/register` | `{ name,email,password }` | Create account; sets auth cookie |
| POST | `/login` | `{ email,password }` | Login; sets cookie |
| POST | `/logout` | – | Clears cookie |
| GET | `/is-auth` | cookie | Returns `{ success, userId }` if valid |
| POST | `/send-verify-otp` | – | Send email verification OTP (auth required) |
| POST | `/verify-account` | `{ otp }` | Verify email |
| POST | `/send-reset-otp` | `{ email }` | Send password reset OTP |
| POST | `/verify-reset-otp` | `{ email,otp }` | Validate reset OTP |
| POST | `/reset-password` | `{ email,otp,newPassword }` | Complete password reset |

### Users (`/api/user`)
| Method | Path | Body | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/data` | – | Current user profile (auth) |
| GET | `/search?query=...` | – | Search users by name/email (auth) |
| POST | `/avatar` | multipart `avatar` | Upload/replace avatar (auth) |

### Notes (`/api/notes`)
| Method | Path | Body | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/upload` | multipart: `image?`, `document?` | Upload note assets |
| GET | `/getNotes` | – | List all notes |
| GET | `/getFiles/:id` | – | Fetch specific note & files |
| POST | `/generateNotes` | `{ prompt | text }` | AI generate notes (provider key required) |

### Posts / Community (`/api/post`)
| Method | Path | Body | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/upload` | `{ title,content,attachments? }` | Create post |
| GET | `/getPost` | – | List posts |
| GET | `/getPostById/:id` | – | Get one post |
| PUT | `/addComment/:id` | `{ content }` | Add comment to post |

### Chat (`/api/chat`)
| Method | Path | Body | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/conversations` | – | List user conversations with unread counts |
| POST | `/conversations/direct` | `{ recipientId }` | Create or fetch direct conversation |
| POST | `/conversations/group` | `{ name,participantIds,adminIds? }` | Create group |
| PUT | `/group` | `{ conversationId,name?,addParticipantIds?,removeParticipantIds? }` | Update group metadata |
| GET | `/messages/:conversationId?page=&limit=` | – | Paginated messages (newest last) |
| POST | `/messages` | `{ conversationId,content?,attachments? }` | Send message |
| POST | `/read` | `{ conversationId,messageIds }` | Mark messages read |
| POST | `/upload` | multipart `files[]` (max 5) | Upload message attachments (returns descriptors) |

### Attachment Object
```
{
  url: string,
  publicId: string,
  type: 'image' | 'video' | 'audio' | 'file',
  size: number,
  name: string
}
```

## Socket.IO Events
Namespace: root (`/`), path `/socket.io`

| Event (Client -> Server) | Payload | Purpose |
| ------------------------ | ------- | ------- |
| `conversation:join` | `{ conversationId }` | Join room to get message events |
| `conversation:leave` | `{ conversationId }` | Leave room |
| `message:send` | `{ conversationId, content?, attachments? }` | Broadcast message (ack `{ ok, message }`) |
| `message:typing` | `{ conversationId, isTyping }` | Typing indicator |

| Event (Server -> Client) | Payload | Purpose |
| ------------------------ | ------- | ------- |
| `message:new` | `{ conversationId, message }` | New incoming message |
| `user:typing` | `{ conversationId,userId,isTyping }` | Typing status of others |
| `message:read` | `{ conversationId,messageIds?,userId }` | Read receipt broadcast |

Auth: cookie JWT is parsed in socket handshake. (Future: optional token header fallback.)

## Development Notes
* CORS origin list adjustable via env vars (empty entries ignored).
* Clean-up of temp upload files after Cloudinary transfer is best-effort.
* Message pagination returns batches newest→oldest per page, appended client-side to enable infinite scroll.

## Roadmap Ideas
* Presence (online/offline) via heartbeat
* Message deletion & editing
* AI summarization of long conversations
* Rate limiting & audit logs

---
Maintained by StudySync Team.
