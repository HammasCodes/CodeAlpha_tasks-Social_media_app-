const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const authenticateToken = require("../middleware/authMiddleware");

// 🔎 Get user profile and their posts
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const posts = await Post.find({ user: user._id }).sort({ timestamp: -1 });
    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile" });
  }
});

// ➕ Follow user
router.post("/:id/follow", authenticateToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) return res.status(404).json({ msg: "User not found" });
    if (targetUser._id.equals(currentUser._id)) return res.status(400).json({ msg: "Can't follow yourself" });

    if (!currentUser.following.includes(targetUser._id)) {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
      await currentUser.save();
      await targetUser.save();
    }

    res.json({ msg: "Followed" });
  } catch (err) {
    res.status(500).json({ msg: "Error following user" });
  }
});

// ➖ Unfollow user
router.post("/:id/unfollow", authenticateToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) return res.status(404).json({ msg: "User not found" });

    currentUser.following = currentUser.following.filter(
      (uid) => !uid.equals(targetUser._id)
    );
    targetUser.followers = targetUser.followers.filter(
      (uid) => !uid.equals(currentUser._id)
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ msg: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ msg: "Error unfollowing user" });
  }
});

module.exports = router;
