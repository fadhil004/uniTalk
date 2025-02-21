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

        let joiningDateFormatted = '-'; // Default jika null
        if (user.partner && user.partner.createdAt) {
            joiningDateFormatted = new Intl.DateTimeFormat('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }).format(new Date(user.partner.createdAt));
        }

        req.user = {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            partnerId: user.partnerId || null,
            logo_partner: user.partner && user.partner.logo_partner ? user.partner.logo_partner : null,
            partnerName: user.partner ? user.partner.nama_partner : 'Register as partner first!',
            status: user.partner && user.partner.status ? user.partner.status : null,
            joining_date: joiningDateFormatted
        };

        next();
    } catch (err) {
        req.session.message = { type: 'error', text: 'Your session is over, please login again!' };
        res.redirect('/login');
    }
};

module.exports = { authentication };
