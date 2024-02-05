const BlogPost = require('../models/BlogPost.js');

const path = require('path');

module.exports = async (req, res) => {
    try {
        console.log("hello juju !");
        let image = req.files.image;
        await image.mv(path.resolve(__dirname, '../public/images', image.name));
        await BlogPost.create({
            ...req.body,
            userid: req.session.userId,
            image: '/images/' + image.name
        });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).send('Oops! Something went wrong.');
    }
};
