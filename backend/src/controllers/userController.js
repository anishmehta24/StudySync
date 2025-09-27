import userModel from "../models/user.model.js";

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
            .select('name email')
            .limit(20)
            .lean();

        return res.json({ success: true, users });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}