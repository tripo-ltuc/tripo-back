const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userImg: String,
    userName: String,
    userComment: String,
  });
  
  const postSchema = new mongoose.Schema({
    userEmail: String,
    userName: String,
    userImg: String,
    content: String,
    cityImg: String,
    cityName: String,
    likes: String,
    comments: [commentSchema],
  });
  
  const postModel = mongoose.model("city", postSchema);

  module.exports = postModel;