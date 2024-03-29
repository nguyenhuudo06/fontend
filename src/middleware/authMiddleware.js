const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const authMiddleware = (req, res, next) => {
    // console.log('checkToken', req.headers.token);
    const token = req.headers.token?.split(' ')[1] ?? "";
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR"
            })
        }
        const { payload } = user;
        if (payload?.isAdmin) {
            next();
        } else {
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR"
            })
        }
    });
}

const authUserMiddleware = (req, res, next) => {
    // Lấy token
    const token = req.headers.token?.split(' ')[1] ?? "";
    const userId = req.params.id;

    // Kiểm tra với Secret key
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR"
            })
        }
        const { payload } = user;
        if (payload?.isAdmin || payload?.id === userId) {
            next();
        } else {
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR"
            })
        }
    });
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}