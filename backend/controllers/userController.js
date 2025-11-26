//Import user model
const User = require('../models/User');

//Import to hash passwords
const bcrypt = require('bcryptjs');

//Import from express-validator
const { validationResult } = require('express-validator');

// POST /api/v1/user/signup
exports.signup = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }

        //Extract data from request
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User created successfully.',
            user_id: newUser._id
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// POST /api/v1/user/login
exports.login = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid Username and password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: 'Invalid Username and password' });
        }

        res.status(200).json({
            message: 'Login successful.'
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};