const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        if (user) {
            const same = await bcrypt.compare(password, user.password);

            if (same) {
                req.session.userId = user._id;
                res.redirect('/');
            } else {
                res.redirect('/auth/login');
            }
        } else {
            console.log("/auth/login:", user);
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.redirect('/auth/login');
    }
}
