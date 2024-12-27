
import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
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
    thumbnail:{
        type:String,
        required:true,
        default: 'https://elafnotes.com/wp-content/uploads/2023/07/pdf-thumbnail-file-2127829-1024x1024.png'
    },
    
    file:{
        type:String,
        required:true,
    },
    uploadedBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})

const notesModel = mongoose.model('notes',notesSchema)

export default notesModel;