const mongoose = require('mongoose')

// Je crée un schéma de données
const Schema = mongoose.Schema;
const BlogPostSchema = new Schema({
    title: String,
    body: String,
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    image: String,
    datePosted: {
        type: Date,
        default: new Date()
    },
});
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = BlogPost;