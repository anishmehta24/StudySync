import mongoose from "mongoose";

const { Schema } = mongoose;

// Conversation supports both direct (1-1) and group chats.
// For direct chats, we compute a participantsHash (sorted userIds) to enforce uniqueness.
const chatConversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "chat_message",
      default: null,
    },
    // For enforcing unique direct conversation between two users
    participantsHash: {
      type: String,
      index: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Indexes for performance
chatConversationSchema.index({ updatedAt: -1 });
chatConversationSchema.index({ participants: 1 });
chatConversationSchema.index({ participantsHash: 1 }, { unique: true, partialFilterExpression: { participantsHash: { $type: "string" } } });

const chatConversationModel =
  mongoose.models?.chat_conversation ||
  mongoose.model("chat_conversation", chatConversationSchema);

export default chatConversationModel;
