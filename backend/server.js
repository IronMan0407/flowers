const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const commentRoutes = require('./routes/comments');
const postRoutes = require('./routes/posts');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://hakuhanna0407_db_user:elB5OJfvhzDxraFi@cluster0.u73rxal.mongodb.net/flowers?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});