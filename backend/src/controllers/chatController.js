import mongoose from "mongoose";
import chatConversationModel from "../models/chatConversation.model.js";
import chatMessageModel from "../models/chatMessage.model.js";
import userModel from "../models/user.model.js";

// Helpers
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const computeParticipantsHash = (participants) => {
  // Only for direct chats: two ids sorted and joined
  if (!participants || participants.length !== 2) return "";
  const [a, b] = participants.map((p) => p.toString()).sort();
  return `${a}_${b}`;
};

// Create or get a direct conversation between the auth user and recipientId
export const createOrGetDirectConversation = async (req, res) => {
  try {
    const { userId } = req.body; // set by userAuth middleware
    const { recipientId } = req.body;
    if (!recipientId) return res.json({ success: false, message: "recipientId is required" });

    if (userId === recipientId)
      return res.json({ success: false, message: "Cannot start a conversation with yourself" });

    const participants = [toObjectId(userId), toObjectId(recipientId)];
    const participantsHash = computeParticipantsHash(participants);

    // Ensure both users exist
    const users = await userModel.find({ _id: { $in: participants } }).select("_id");
    if (users.length !== 2) return res.json({ success: false, message: "User not found" });

    let conversation = await chatConversationModel.findOne({ type: "direct", participantsHash });
    if (!conversation) {
      conversation = await chatConversationModel.create({
        type: "direct",
        participants,
        participantsHash,
      });
    }

    return res.json({ success: true, conversation });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Create a group conversation
export const createGroupConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const { name, participantIds = [], adminIds = [] } = req.body;
    if (!name || !name.trim()) return res.json({ success: false, message: "Group name is required" });

    const uniqueIds = Array.from(
      new Set([userId, ...participantIds])
    );
    const participants = uniqueIds.map((id) => toObjectId(id));
    const admins = Array.from(new Set([userId, ...adminIds])).map((id) => toObjectId(id));

    // Validate users
    const count = await userModel.countDocuments({ _id: { $in: participants } });
    if (count !== participants.length)
      return res.json({ success: false, message: "Some participants not found" });

    const conversation = await chatConversationModel.create({
      type: "group",
      name: name.trim(),
      participants,
      admins,
    });
    return res.json({ success: true, conversation });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const listConversations = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversations = await chatConversationModel
      .find({ participants: toObjectId(userId) })
      .sort({ updatedAt: -1 })
      .populate({ path: "lastMessage" })
      .lean();

    // Hydrate participant summaries for UI
    const userIds = new Set();
    conversations.forEach((c) => c.participants.forEach((p) => userIds.add(p.toString())));
    const users = await userModel
      .find({ _id: { $in: Array.from(userIds).map((id) => toObjectId(id)) } })
  .select("name email avatarUrl")
      .lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // Compute unread counts per conversation (messages not read by me and not sent by me)
    const result = []
    for (const c of conversations) {
      let unreadCount = 0
      try {
        unreadCount = await chatMessageModel.countDocuments({
          conversationId: c._id,
          readBy: { $ne: toObjectId(userId) },
          senderId: { $ne: toObjectId(userId) },
        })
      } catch {}
      result.push({
        ...c,
        unreadCount,
        participantProfiles: c.participants.map((pid) => userMap.get(pid.toString()) || null),
      })
    }

    return res.json({ success: true, conversations: result });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.body;
    const { conversationId } = req.params;
    const page = parseInt(req.query.page || "1", 10);
    const limit = Math.min(parseInt(req.query.limit || "30", 10), 100);
    const skip = (page - 1) * limit;

    const conversation = await chatConversationModel.findById(conversationId).select("participants");
    if (!conversation) return res.json({ success: false, message: "Conversation not found" });
    if (!conversation.participants.map(String).includes(userId))
      return res.json({ success: false, message: "Forbidden" });

    const messages = await chatMessageModel
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({ success: true, messages: messages.reverse(), page, limit });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.body;
    const { conversationId, content = "", attachments = [] } = req.body;
    if (!conversationId) return res.json({ success: false, message: "conversationId is required" });

    const conversation = await chatConversationModel.findById(conversationId).select("participants");
    if (!conversation) return res.json({ success: false, message: "Conversation not found" });
    if (!conversation.participants.map(String).includes(userId))
      return res.json({ success: false, message: "Forbidden" });

    if (!content.trim() && (!attachments || attachments.length === 0))
      return res.json({ success: false, message: "Message must have content or attachments" });

    const message = await chatMessageModel.create({
      conversationId: toObjectId(conversationId),
      senderId: toObjectId(userId),
      content: content.trim(),
      attachments,
      readBy: [toObjectId(userId)],
    });

    await chatConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    // If socket.io is attached to req.app locals, emit to room
    try {
      const io = req.app.get("io");
      if (io) io.to(conversationId).emit("message:new", { conversationId, message });
    } catch {}

    return res.json({ success: true, message });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    const { conversationId, messageIds = [] } = req.body;
    if (!conversationId) return res.json({ success: false, message: "conversationId is required" });
    if (!Array.isArray(messageIds) || messageIds.length === 0)
      return res.json({ success: false, message: "messageIds required" });

    const conversation = await chatConversationModel.findById(conversationId).select("participants");
    if (!conversation) return res.json({ success: false, message: "Conversation not found" });
    if (!conversation.participants.map(String).includes(userId))
      return res.json({ success: false, message: "Forbidden" });

    await chatMessageModel.updateMany(
      { _id: { $in: messageIds.map(toObjectId) }, conversationId: toObjectId(conversationId) },
      { $addToSet: { readBy: toObjectId(userId) } }
    );

    try {
      const io = req.app.get("io");
      if (io) io.to(conversationId).emit("message:read", { conversationId, messageIds, readerId: userId });
    } catch {}

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Manage group membership
export const updateGroup = async (req, res) => {
  try {
    const { userId } = req.body;
    const { conversationId, name, addParticipantIds = [], removeParticipantIds = [], adminIds } = req.body;
    const convo = await chatConversationModel.findById(conversationId);
    if (!convo) return res.json({ success: false, message: "Conversation not found" });
    if (convo.type !== "group") return res.json({ success: false, message: "Not a group chat" });
    if (!convo.admins.map(String).includes(userId)) return res.json({ success: false, message: "Only admins can update the group" });

    const toAdd = addParticipantIds.map(toObjectId);
    const toRemove = new Set(removeParticipantIds.map(String));

    let participants = convo.participants.map((p) => p.toString());
    participants = Array.from(new Set([...participants, ...toAdd.map(String)])).filter((id) => !toRemove.has(id));

    const update = { participants: participants.map(toObjectId) };
    if (typeof name === "string") update.name = name.trim();
    if (Array.isArray(adminIds)) update.admins = adminIds.map(toObjectId);

    const updated = await chatConversationModel.findByIdAndUpdate(conversationId, update, { new: true });
    return res.json({ success: true, conversation: updated });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
