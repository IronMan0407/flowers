const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment.js');

// Get comments for an image
router.get('/:imageId', async (req, res) => {
  try {
    const comments = await Comment.find({ imageId: req.params.imageId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new comment
router.post('/', async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;