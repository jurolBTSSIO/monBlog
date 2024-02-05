const User = require("../models/User");

module.exports = async (req, res) => {
    try {
        const user = await User.create(req.body);
        console.log(user);
        res.redirect('/');
    } catch (error) {
        console.error(error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            req.flash('validationErrors', validationErrors);
            req.flash('data', req.body);
            return res.redirect('/auth/register');
        }

        // Handle other types of errors
        req.flash('error', 'An error occurred during user registration.');
        res.redirect('/auth/register');
    }
};