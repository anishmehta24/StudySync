import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import {
  createOrGetDirectConversation,
  createGroupConversation,
  listConversations,
  getMessages,
  sendMessage,
  markAsRead,
  updateGroup,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

// Conversations
chatRouter.post("/conversations/direct", userAuth, createOrGetDirectConversation);
chatRouter.post("/conversations/group", userAuth, createGroupConversation);
chatRouter.get("/conversations", userAuth, listConversations);

// Messages
chatRouter.get("/messages/:conversationId", userAuth, getMessages);
chatRouter.post("/messages", userAuth, sendMessage);
chatRouter.post("/read", userAuth, markAsRead);

// Group updates
chatRouter.put("/group", userAuth, updateGroup);

export default chatRouter;

// Upload attachments
chatRouter.post("/upload", userAuth, upload.array("files", 5), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.json({ success: false, message: "No files uploaded" });

    const attachments = [];
    for (const f of files) {
      const result = await uploadOnCloudinary(f.path);
      // Best-effort local cleanup
      try { fs.unlinkSync(f.path); } catch {}
      if (result?.url) {
        const resourceType = result.resource_type; // image, video, raw
        const type = ["image", "video"].includes(resourceType) ? resourceType : (f.mimetype?.startsWith("audio/") ? "audio" : (f.mimetype?.startsWith("image/") ? "image" : (f.mimetype?.startsWith("video/") ? "video" : "file")));
        attachments.push({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          type,
          size: f.size || 0,
          name: f.originalname || "",
        });
      }
    }

    return res.json({ success: true, attachments });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});
