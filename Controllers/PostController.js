import PostModel from "../Models/postModel.js";

// create a new post
export const createPost = async (req, res) => {
  // anything user enters in body , save it in our posts in database created using database
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
    console.log("this post is posted/created");
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a post
export const getPost = async (req, res) => {
  const { id } = req.params; // postId

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
    console.log("got the post");
  } catch (error) {}
};

// update an existing post
export const updatePost = async (req, res) => {
  // const postId = req.params.id;
  // or
  const { id: postId } = req.params; // renamed id as postId, or you can just use id as well.

  const { userId } = req.body;

  try {
    // find the post you want to update
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      // update the post with what user provided only if userId of that post in out database matches to the userId provided by user
      await post.updateOne({ $set: req.body });
      res.status(200).json("Your post is updated");
    } else {
      res
        .status(403)
        .json("Action Forbidden! You can only update your own post.");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// deleting a post
export const deletePost = async (req, res) => {
  const { id } = req.params; // it is postId
  const { userId } = req.body; // it is userId of the user who posted it

  try {
    // find the post you want to delete
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      // delete the post only if userId of that post in out database matches to the userId provided by user
      await post.deleteOne();
      res.status(200).json("Your post is deleted!");
    } else {
      res
        .status(403)
        .json("Action Forbidden! You can only delete your own post.");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like and unlike a post
export const likeAndUnlikePost = async (req, res) => {
  const { id } = req.params; // postId you want to like or unlike
  const { userId } = req.body;

  try {
    // find the post you want to like or unlike
    const post = await PostModel.findById(id);

    // if that post object's likes[] array doesnot have your userId then it means you havenot liked the post and now you can like the post, otherwise it means that you have already like the post and now you can only unlike the post
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
