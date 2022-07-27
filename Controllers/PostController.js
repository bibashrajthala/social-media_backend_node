import mongoose from "mongoose";
import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";

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

// get timeline posts (to display those posts in your social media timeline/feeds)
// timeline should display the posts you posted yourself and the posts posted by users in your following array/list ie the posts of users you have followed
// bibash follows ram and abhishek. his timeline will have his posts along with ram and abhishek's post
export const getTimelinePosts = async (req, res) => {
  const { userId } = req.params; // your userId(ie, userId of user logged in)
  //or
  //   const userId = req.params.userId;
  try {
    // all your posts, ie, posts with your userId in it
    const currentUserPosts = await PostModel.find({ userId: userId }); // all posts of bibash himself

    // we want to perform query on UserModel but want result(ie post objects) of PostModel, so we make a aggregate() pipeline for that
    // all posts of ram and abhishek
    const followingPosts = await UserModel.aggregate([
      {
        // match the  user _id of users database with the current userId
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        // in that matched user (ie,bibash myself) ,i want to lookup in the following array[] of users database to check and get the each post of posts database of matched userId key of post
        // ie if  userId of any post matches any of user's id of following[] list of currentUser,Then put that post object in followingPosts[]
        $lookup: {
          from: "posts", // the db doc we want to look up
          localField: "following", // the field in our db we are operating currently , here users ie UserModel
          foreignField: "userId", // the field in our db that we want to integrate(posts) with current db(users) that we want to lookup in localfield (following[] of users)
          as: "followingPosts", // the result array after lookup,  array of all posts whose userId is present inside followings[] of currentUser
        },
      },
      {
        // return/result of aggregation ie the fields we want to return
        $project: {
          followingPosts: 1, // we want the followingPosts field which has an object followingPosts result array with post objects
          _id: 0, // we dont want the id field given defaultly so neglect it
        },
      },
    ]);

    // console.log(followingPosts);
    // res.status(200).json(currentUserPosts.concat(followingPosts));
    res.status(200).json(
      currentUserPosts
        .concat(followingPosts[0].followingPosts) // concat the currentUserPosts array and folllowingPosts array to make a response array of all posts of both the arrays in it in same level.
        .sort((a, b) => b.createdAt - a.createdAt) // sort the post objects in order of their created time/date(latest to old) instead of the order(your posts first then the posts of users you followed),then send that sorted array as response
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
