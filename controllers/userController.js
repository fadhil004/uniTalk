const { User, Partner } = require('../models');
const { comparePassword, hashPassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const path = require('path');
const fs = require('fs');

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

            req.session.message = { type: 'success', text: `Registered successfully! Welcome, ${user.name}.` };
            res.redirect('/');
            //res.status(201).json({ message: 'User registered successfully', user, token });
        } catch (error) {
            console.error(error);
            res.status(500).send('<script>alert("Registrasi gagal!"); window.location.href="/";</script>');
            //res.status(500).json({ message: 'Failed to register user', error });
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

                req.session.message = { type: 'success', text: `Login success! Welcome, ${user.name}.` };
                
                if (user.role === 'admin') {
                    return res.redirect('/admin'); 
                } else {
                    return res.redirect('/'); 
                }
                // return res.status(200).json({
                //     message: `User login as ${user.role} successfully`,
                //     user,
                //     token
                // });                
            } else{
                req.session.message = { type: 'error', text: 'Email or password is incorrect!' };
                return res.redirect('/login');
                // res.status(500).json({ message: 'Failed to login user', error });
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('<script>alert("Login gagal!"); window.location.href="/";</script>');
            // res.status(500).json({ message: 'Failed to login user', error });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                include: {
                    model: Partner,
                    as: 'partner', // Relasi dengan Partner
                    attributes: ['id', 'nama_partner', 'status'] // Pilih atribut yang ingin ditampilkan
                },
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
    static async formLogin(req, res) {
        try {
            let message = req.session.message;
            req.session.message = null; 
            res.render('login', { message, cache: false, layout: 'login' });
        } catch (err) {
            console.error('Error rendering dashboard:', err);
            res.status(500).send(err.message);
        }
    }
    
    static async updateProfile(req, res) {
        try {
            const { name, email, password, partner_name } = req.body;
            const userId = req.decoded.id; 
            const user = await User.findByPk(userId, { include: { model: Partner, as: 'partner' } });

            if (!user) {
                req.session.message = { type: 'error', text: 'User not found!' };
                return res.redirect('/partner');
            }

            // Cek jika email diubah, pastikan email unik
            if (email && email !== user.email) {
                const emailExists = await User.findOne({ where: { email } });
                if (emailExists) {
                    req.session.message = { type: 'error', text: 'Email already in use!' };
                    return res.redirect('/partner');
                }
                user.email = email;
            }

            // Update username jika diisi
            if (name) user.name = name;

            // Update password jika diisi
            if (password) user.password = hashPassword(password);

            // Update partner jika user punya partner
            if (user.partner) {
                if (partner_name) user.partner.nama_partner = partner_name;

                // Cek jika ada file logo baru
                if (req.file) {
                    const oldLogoPath = `public/database/logo_partner/${user.partner.logo_partner}`;

                    // Hapus file lama jika ada
                    if (user.partner.logo_partner && fs.existsSync(oldLogoPath)) {
                        fs.unlinkSync(oldLogoPath);
                    }

                    // Simpan file baru
                    user.partner.logo_partner = req.file.filename;
                }

                await user.partner.save();
            }

            await user.save();

            req.session.message = { type: 'success', text: 'Profile updated successfully!' };
            res.redirect('/partner');
        } catch (error) {
            console.error(error);
            req.session.message = { type: 'error', text: 'Failed to update profile!' };
            res.redirect('/partner');
        }
    }
}

module.exports =  userController ;
