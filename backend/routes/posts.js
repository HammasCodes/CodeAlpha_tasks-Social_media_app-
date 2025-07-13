const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authenticateToken = require("../middleware/authMiddleware");

// 📝 Create a new post
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { content, imageURL } = req.body;
    const newPost = new Post({
      user: req.user.id,
      content,
      imageURL,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ msg: "Error creating post" });
  }
});

// 📄 Get all posts (feed)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 }).populate("user", "username profilePicURL");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching posts" });
  }
});

// 🧹 Delete your own post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not allowed to delete this post" });

    await post.remove();
    res.json({ msg: "Post deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting post" });
  }
});
// 👍 Like a post
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }

    res.json({ msg: "Post liked" });
  } catch (err) {
    res.status(500).json({ msg: "Error liking post" });
  }
});

// 👎 Unlike a post
router.post("/:id/unlike", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.likes = post.likes.filter((uid) => uid.toString() !== req.user.id);
    await post.save();

    res.json({ msg: "Post unliked" });
  } catch (err) {
    res.status(500).json({ msg: "Error unliking post" });
  }
});


module.exports = router;
