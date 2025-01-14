const { registerUser } = require('../controllers/UserController');

    router.post('/users/register', registerUser);
