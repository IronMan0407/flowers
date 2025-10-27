const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/Post');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newPost = new Post({
      text: req.body.text,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;