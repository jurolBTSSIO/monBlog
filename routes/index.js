const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost'); // Import your BlogPost model

router.get('/', async (req, res) => {
  try {
    const blogposts = await BlogPost.find({});
    res.render('index', { blogposts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

