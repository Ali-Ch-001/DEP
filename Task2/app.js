const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up EJS for templating
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema and Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render('index', { posts: posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving posts');
  }
});

app.get('/posts/:id', async (req, res) => {
  const requestedPostId = req.params.id;
  try {
    const post = await Post.findById(requestedPostId);
    res.render('show', { post: post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving post');
  }
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', async (req, res) => {
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  try {
    await newPost.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating post');
  }
});

app.get('/posts/:id/edit', async (req, res) => {
  const requestedPostId = req.params.id;
  try {
    const post = await Post.findById(requestedPostId);
    res.render('edit', { post: post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving post for edit');
  }
});

app.post('/posts/:id/edit', async (req, res) => {
  const requestedPostId = req.params.id;
  try {
    await Post.updateOne(
      { _id: requestedPostId },
      { title: req.body.postTitle, content: req.body.postContent }
    );
    res.redirect('/posts/' + requestedPostId);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating post');
  }
});

app.post('/posts/:id/delete', async (req, res) => {
  const requestedPostId = req.params.id;
  try {
    await Post.deleteOne({ _id: requestedPostId });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting post');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});