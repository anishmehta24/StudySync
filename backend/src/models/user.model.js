import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
    },
    // Avatar fields
    avatarUrl: { type: String, default: '' },
    avatarPublicId: { type: String, default: '' },

    verifyOtp:{
        type:String,
        default: ''
    },
    verifyOtpExpiredAt:{
        type:Number,
        default: 0
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetOtp:{
         type:String,
        default: ''
    },
    resetOtpExpiredAt:{
        type:Number,
        default: 0
    },
}, { timestamps: true })

const userModel = mongoose.models?.user || mongoose.model('user',userSchema)

export default userModel;