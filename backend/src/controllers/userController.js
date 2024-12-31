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