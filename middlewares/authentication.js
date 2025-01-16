const jwt = require('../helpers/jwt');

const authentication = (req, res, next) => {
    try {
        let token = req.session.token;

        if (!token) {
            throw { message: 'You should login first!', status: 401 };
        }
        console.log(token)
        let decode = jwt.verifyToken(token);
        req.decoded = decode;
        next();
    } catch (err) {
        res.status(401).json({ message: 'You should login first!', error: error.message });
    }
};

module.exports = { authentication };
