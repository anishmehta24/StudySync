import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";


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

        const postsWithAuthors = await Promise.all(
            post.map(async (p) => {
                const user = await userModel.findById(p.uploadedBy).select("name");
                return {
                    ...p._doc,
                    author: user ? user.name : "Unknown", 
                };
            })
      );

        res.json({data:postsWithAuthors});
        
    } catch (error) {
        console.error(error);
          res.status(500).send({ message: "Server error", error });
    }
}


export const getPostByID = async (req,res) => {
    try {

        const {id} = req.params;
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
          }
          
          
        const user = await userModel.findById(post.uploadedBy).select("name");
      
          res.status(200).json({ success: true, data: post , user:user });
        
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}


// Controller to add a comment to a post
export const addCommentToPost = async (req, res) => {
  try {
    const { id } = req.params; 
    const { comment } = req.body; 

    
    if (!comment || !comment.text || !comment.user) {
      return res.status(400).json({ success: false, message: 'Invalid comment data.' });
    }

    const user = await userModel.findById(comment.user).select("name");

    // Find the post by ID
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }
    post.comments.push({
      text: comment.text,
      user: user.name, 
      createdAt: Date.now(),
    });


    await post.save();

    res.status(200).json({ success: true, message: 'Comment added successfully.', data: post });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
