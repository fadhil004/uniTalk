const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const userController  = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const dashboardController = require('../controllers/dashboardController');
const { uploadSingle } = require('../helpers/uploadLogo');
const { authentication } = require('../middlewares/authentication');
const { authorizeAdmin, authorizePartner, authorization } = require('../middlewares/authorization');

//partnerController
router.post('/partners/register', authentication, uploadSingle('logo_partner'), partnerController.registerPartner); 
router.get('/partners', authentication, authorizeAdmin, partnerController.getAllPartners); 
router.delete('/partners/:id', authentication, authorizeAdmin, partnerController.deletePartner);
router.post('/partners/update-status/:id', authentication, authorizeAdmin, partnerController.updatePartnerStatus);

//chatController
router.get('/chats', authentication, authorizePartner, chatController.getPartnerChats)

//userController
router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/users', authentication, authorizeAdmin, userController.getAllUsers);
router.get('/users/:id', authentication, authorizeAdmin, userController.getUserById);
router.get('/login', userController.formLogin);
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
router.post('/edit-profile', uploadSingle('logo_partner'), authentication, authorizePartner, userController.updateProfile)


//dashboardController
router.get('/', authentication, authorization, dashboardController.dashboardPartner)
router.get('/partner', authentication, authorization, dashboardController.partner)
router.get('/chat', authentication, authorization, dashboardController.chat)
router.get('/help-center', authentication, authorization, dashboardController.helpCenter)
router.get('/admin', authentication, authorizeAdmin, dashboardController.dashboardAdmin)
router.get('/partnersData', authentication, authorizeAdmin, dashboardController.partnersData)
router.get('/approval', authentication, authorizeAdmin, dashboardController.approval)
router.get('/api/dashboard-data', authentication, authorizeAdmin, dashboardController.dashboardAdminData)

//testing
router.get('/test', dashboardController.test);

module.exports = router