const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId);

        if (!user) {
            console.error('User not found in authMiddleware');
            return res.redirect('/auth/login');
        }

        // Vous pouvez également attacher les données de l'utilisateur à la demande
        req.user = user;

        next();
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        res.status(500).send('Internal Server Error');
    }
};

