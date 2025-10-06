// require('dotenv').config()
import dotenv from "dotenv";
import connectDB from "../src/db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import chatConversationModel from "./models/chatConversation.model.js";
import chatMessageModel from "./models/chatMessage.model.js";

dotenv.config({
    path:'./env'
})

connectDB()
    .then(() => {
        const server = http.createServer(app);

        const rawAllowed = [
            process.env.CORS_ORIGIN_1,
            process.env.CORS_ORIGIN_2,
            process.env.CORS_ORIGIN_3,
        ].filter(Boolean);

        const normalizeOrigin = (o) => {
            try {
                if (!o) return '';
                const u = new URL(o);
                return u.origin; // strips path / trailing slash
            } catch { return o; }
        };

        const allowedOrigins = rawAllowed.map(normalizeOrigin);
        if (allowedOrigins.length === 0) {
            console.warn('[Socket.IO] No CORS_ORIGIN_* env vars set. All origins will be temporarily allowed (development fallback).');
        } else {
            console.log('[Socket.IO] Allowed origins:', allowedOrigins.join(', '));
        }

        const io = new Server(server, {
            cors: {
                origin: (origin, cb) => {
                    // Allow no origin (mobile apps, same-origin) or matching normalized origin
                    if (!origin) return cb(null, true);
                    const norm = normalizeOrigin(origin);
                    if (allowedOrigins.length === 0 || allowedOrigins.includes(norm)) return cb(null, true);
                    console.warn('[Socket.IO] CORS blocked origin:', origin, 'normalized:', norm);
                    return cb(new Error('Not allowed by CORS'));
                },
                credentials: true,
                methods: ["GET","POST","PUT","DELETE","OPTIONS"],
            },
            transports: ["websocket", "polling"],
            path: process.env.SOCKET_PATH || "/socket.io",
        });

        // Make io available in routes/controllers
        app.set("io", io);

        io.use((socket, next) => {
            try {
                const rawCookie = socket.request.headers.cookie || "";
                let token = '';
                try {
                    const cookies = cookie.parse(rawCookie);
                    token = cookies.token || '';
                } catch {}

                // Optional token via handshake.auth (useful if cookies blocked cross-site)
                if (!token && socket.handshake?.auth?.token) {
                    token = socket.handshake.auth.token;
                }

                if (!token) {
                    return next(new Error('Unauthorized'));
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const uid = decoded?.id || decoded?._id;
                if (!uid) return next(new Error('Unauthorized'));
                socket.userId = String(uid);
                return next();
            } catch (err) {
                return next(err);
            }
        });

        io.on("connection", (socket) => {
            const userId = socket.userId;
            socket.join(userId); // personal room for notifications

            socket.on("conversation:join", async ({ conversationId }) => {
                try {
                    const convo = await chatConversationModel.findById(conversationId).select("participants");
                    if (!convo) return;
                    if (!convo.participants.map(String).includes(userId)) return;
                    socket.join(conversationId);
                    socket.to(conversationId).emit("user:typing", { conversationId, userId, isTyping: false });
                } catch {}
            });

            socket.on("conversation:leave", ({ conversationId }) => {
                socket.leave(conversationId);
            });

            socket.on("message:send", async ({ conversationId, content = "", attachments = [] }, cb) => {
                try {
                    const convo = await chatConversationModel.findById(conversationId).select("participants");
                    if (!convo || !convo.participants.map(String).includes(userId)) return;

                    if (!content.trim() && (!attachments || attachments.length === 0)) return;

                    const msg = await chatMessageModel.create({
                        conversationId,
                        senderId: userId,
                        content: content.trim(),
                        attachments,
                        readBy: [userId],
                    });
                    await chatConversationModel.findByIdAndUpdate(conversationId, { lastMessage: msg._id, updatedAt: new Date() });
                    io.to(conversationId).emit("message:new", { conversationId, message: msg });
                    if (cb) cb({ ok: true, message: msg });
                } catch (e) {
                    if (cb) cb({ ok: false, error: e.message });
                }
            });

            socket.on("message:typing", ({ conversationId, isTyping }) => {
                socket.to(conversationId).emit("user:typing", { conversationId, userId, isTyping: !!isTyping });
            });

            socket.on("message:read", async ({ conversationId, messageIds = [] }) => {
                try {
                    await chatMessageModel.updateMany(
                        { _id: { $in: messageIds }, conversationId },
                        { $addToSet: { readBy: userId } }
                    );
                    io.to(conversationId).emit("message:read", { conversationId, messageIds, readerId: userId });
                } catch {}
            });

            socket.on("disconnect", () => {
                // Presence cleanup can be added here
            });
        });

        const PORT = process.env.PORT || 8000;
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((e) => {
        console.log("Database connection failed", e);
    });