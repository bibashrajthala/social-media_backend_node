import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      // id of user that posted it, andBy defalult it  will have another id of each post
      type: String,
      required: true,
    },
    desc: String, // description is string
    likes: [], // likes will have userIds that liked the post
    image: String,
  },
  // it gives createdAt and updatedAt time properties by default,so that we dont have to do "createdAt":Date.now()
  { timestamps: true }
);

const PostModel = mongoose.model("posts", postSchema);

export default PostModel;
