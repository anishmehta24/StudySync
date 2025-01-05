import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:true,
    },
    tags:{
        type: String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref:"user"
    },
    upVotes: {
        type: Array,
        default: [],
    },
    
    downVotes: {
        type: Array,
        default: [],
    },
    
    comments: {
        type: [
            {
              text: { type: String, required: true },
              user: { type: String,required:true }, 
              createdAt: { type: Date, default: Date.now },
            },
          ],
          default: [],
    },

})

const postModel = mongoose.model('post',postSchema)

export default postModel