import postModel from "../models/post.model.js";


export const uploadPost = async(req,res) => {
    const {title,description,tags, user} = req.body;
    try {

        const newPost = new postModel({
            title,
            description,
            tags,
            uploadedBy:user,
            createdAt:Date.now(),
        })

        await newPost.save()
        res.status(200).json({
            success: true,
            message: 'Post uploaded successfully',
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}