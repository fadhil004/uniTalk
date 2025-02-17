const jwt = require('../helpers/jwt');
const { User, Partner } = require('../models');

const authentication = async (req, res, next) => {
    try {
        let token = req.session.token;

        if (!token) {
            req.session.message = { type: 'error', text: 'You must login first!' };
            return res.redirect('/login');    
        }
        console.log("Token dari session:", token);
        let decode = jwt.verifyToken(token);
        req.decoded = decode;

        console.log("test1")
        let user = await User.findByPk(decode.id, {
            include: [{ model: Partner, as: 'partner' }]
        });

        console.log("test2")
        if (!user) {
            req.session.message = { type: 'error', text: 'Account not found!' };
            return res.redirect('/login');
        }

        req.user = {
            id: user.id,
            name: user.name,
            role: user.role,
            partnerId : user.partnerId,
            partnerName: user.partner ? user.partner.nama_partner : 'Register as partner first!'
        };

        next();
    } catch (err) {
        req.session.message = { type: 'error', text: 'Your session is over, please login again!' };
        res.redirect('/login');
    }
};

module.exports = { authentication };
