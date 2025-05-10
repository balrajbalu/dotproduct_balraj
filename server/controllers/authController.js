const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ result: 0, message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ result: 0, message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ result: 0, message: 'Invalid credentials.' });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            result: 1,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ result: 0, message: 'Internal Server Error' });
    }
};
exports.checkUserRole = async (req, res) => {
    const userId = req.user.id;
    if(!userId){
        return res.status(401).json({ result: 0, message: 'Unauthorized' });
    }
    try{
        const user = await User.findById(userId);
        if(user.role === 1){
            return res.status(200).json({ result: 1, message: 'User is an admin' });
        }else{
            return res.status(200).json({ result: 0, message: 'User is not an admin' });
        }
    }catch(error){
        console.error('Error checking user role:', error);
        return res.status(500).json({ result: 0, message: 'Internal Server Error' });
    }
}