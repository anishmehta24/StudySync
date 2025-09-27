import userModel from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const getUserData= async(req,res)=>{
    try {

        const {userId}=req.body;

        const user = await userModel.findById(userId);

        if(!user) {
            return res.json({success:false , message:"User not found"})
        }

        res.json({
            success:true,
            userData:{
                name: user.name,
                id:userId,
                email:user.email,
                isAccountVerified:user.isAccountVerified,
                avatarUrl: user.avatarUrl || '',
            }
        })

    } catch (error) {
        
    }
}

// Search users by name or email (case-insensitive). Excludes the requester.
export const searchUsers = async (req, res) => {
    try {
        const { userId } = req.body;
        const { query } = req.query;
        if (!query || !query.trim()) {
            return res.json({ success: true, users: [] });
        }

        const q = query.trim();
        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        const users = await userModel
            .find({
                _id: { $ne: userId },
                $or: [{ name: regex }, { email: regex }],
            })
            .select('name email avatarUrl')
            .limit(20)
            .lean();

        return res.json({ success: true, users });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Upload/update avatar for the logged-in user
export const updateAvatar = async (req, res) => {
    try {
        const { userId } = req.body
        const file = req.file
        if (!file) return res.json({ success: false, message: 'No file provided' })

        const upload = await uploadOnCloudinary(file.path)
        try { fs.unlinkSync(file.path) } catch {}
        if (!upload?.secure_url) return res.json({ success: false, message: 'Upload failed' })

        const updated = await userModel.findByIdAndUpdate(
            userId,
            { avatarUrl: upload.secure_url, avatarPublicId: upload.public_id },
            { new: true }
        ).select('name email isAccountVerified avatarUrl')

        return res.json({ success: true, user: updated })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}