require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const commentRoutes = require('./routes/comments');
const postRoutes = require('./routes/posts');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://flowers-six-zeta.vercel.app',
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('connection error:', err));

// Routes
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});