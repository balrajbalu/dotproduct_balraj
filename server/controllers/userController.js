const bcrypt = require('bcrypt');
const userModel = require('../models/user');
exports.createUser = async (req, res) => {
    try {
        const { email, password, firstname, lastname, mobile, role } = req.body;
        if (!email || !password || !firstname || !role) {
            return res.status(400).json({
                result: 0,
                message: 'Email, password, firstname, and role are required.',
            });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                result: 0,
                message: 'A user with this email already exists.',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            email,
            password: hashedPassword,
            firstname,
            lastname: lastname || '',
            mobile: mobile || '',
            role,
            isActive: true,
        });

        await newUser.save();

        return res.status(201).json({
            result: 1,
            message: 'User created successfully.',
            data: {
                id: newUser._id,
                email: newUser.email,
                firstname: newUser.firstname,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ result: 0, message: 'Internal Server Error' });
    }
};