const jwt = require('../helpers/jwt');

const authentication = (req, res, next) => {
    try {
        let token = req.session.token;

        if (!token) {
            req.session.message = { type: 'error', text: 'You must login first!' };
            return res.redirect('/login');    
        }
        console.log("Token dari session:", token);
        let decode = jwt.verifyToken(token);
        req.decoded = decode;
        next();
    } catch (err) {
        res.redirect('/login');
    }
};

module.exports = { authentication };
