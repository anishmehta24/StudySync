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

export const getPost = async(req,res) => {
    try {

        const {title,tags} = req.query;
        const query = {}
        if(title) {
            query.title = {
                $regex: title,
                $options: "i"
            };
        }
        if(tags) {
            query.tags = {
                $regex: tags,
                $options: "i"
            };
        }

        const post = await postModel.find(query)

        res.json({data:post});
        
    } catch (error) {
        console.error(error);
          res.status(500).send({ message: "Server error", error });
    }
}