const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    default: "",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
