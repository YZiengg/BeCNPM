const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication failed',
                status: 'ERROR'
            });
        }

        const { payload } = user;

        if (payload?.isAdmin) {
            return next(); // Nếu là admin, cho phép tiếp tục
        } else {
            return res.status(403).json({
                message: 'Permission denied',
                status: 'ERROR'
            });
        }
    });
};

const authUerMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1];
    const userId= req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication failed',
                status: 'ERROR'
            });
        }

        const { payload } = user;

        if (payload?.isAdmin || payload?.id === userId) {
            return next(); // Nếu là admin, cho phép tiếp tục
        } else {
            return res.status(403).json({
                message: 'Permission denied',
                status: 'ERROR'
            });
        }
    });
};

module.exports = {
    authMiddleware,
    authUerMiddleWare
}
