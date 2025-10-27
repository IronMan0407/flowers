const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: String,
  imageUrl: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);