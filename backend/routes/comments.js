const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const authenticateToken = require("../middleware/authMiddleware");

// 📝 Add a comment
router.post("/:postId", authenticateToken, async (req, res) => {
  try {
    const newComment = new Comment({
      post: req.params.postId,
      user: req.user.id,
      text: req.body.text
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ msg: "Error posting comment" });
  }
});

// 📄 Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ timestamp: -1 })
      .populate("user", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching comments" });
  }
});

module.exports = router;
