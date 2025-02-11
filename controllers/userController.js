const { User, Partner } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

class userController{
    static async registerUser (req, res){
        try {
            const { name, email, password, role} = req.body;

            const existingUser = await User.findOne({where: {email}});
            if (existingUser){
                return res.status(400).json({ message: 'Email already in use' });
            }

            const user = await User.create({
                name,
                email,
                password,
                role : 'partner',
                partnerId: null,
            });
    
            let payload = {
                id : user.id,
                name : user.name,
                role : user.role,
                partnerId : user.partnerId
            }
            let token = generateToken(payload);
            req.session.token = token;

            res.status(201).json({ message: 'User registered successfully', user, token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to register user', error });
        }
    }; 
    static async login (req, res){
        try {
            const {email, password} = req.body;

            const user = await User.findOne({
                where: { email }
            })

            if (user && comparePassword(password, user.password)){
                let payload = {
                    id : user.id,
                    name : user.name,
                    role : user.role,
                    partnerId : user.partnerId
                };
                let token = generateToken(payload);
                req.session.token = token;
                return res.status(200).json({
                    message: `User login as ${user.role} successfully`,
                    user,
                    token
                });                
            } else{
                //res.redirect
                res.status(500).json({ message: 'Failed to login user', error });
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Failed to login user', error });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                // include: {
                //     model: Partner,
                //     as: 'partner', // Relasi dengan Partner
                //     attributes: ['id', 'name'] // Pilih atribut yang ingin ditampilkan
                // },
                attributes: { exclude: ['password'] } // Jangan tampilkan password
            });

            res.status(200).json({ message: "Users retrieved successfully", users });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch users", error });
        }
    }
    static async getUserById(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id, {
                include: {
                    model: Partner,
                    as: 'partner', 
                    attributes: ['id', 'nama_partner', 'logo_partner', 'api_key', 'status']
                },
                attributes: { exclude: ['password'] } 
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User retrieved successfully', user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch user', error });
        }
    }   
}

module.exports =  userController ;
