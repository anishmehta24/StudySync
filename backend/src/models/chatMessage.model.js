import mongoose from "mongoose";

const { Schema } = mongoose;

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    type: { type: String, enum: ["image", "video", "file", "audio", "other"], default: "other" },
    size: { type: Number, default: 0 }, // bytes
    name: { type: String, default: "" },
  },
  { _id: false }
);

const chatMessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "chat_conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    content: { type: String, default: "" },
    attachments: { type: [attachmentSchema], default: [] },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

chatMessageSchema.index({ conversationId: 1, createdAt: -1 });

const chatMessageModel =
  mongoose.models?.chat_message ||
  mongoose.model("chat_message", chatMessageSchema);

export default chatMessageModel;
