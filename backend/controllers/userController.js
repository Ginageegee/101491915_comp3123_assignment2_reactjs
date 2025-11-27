// Import User model
const User = require('../models/User');

// Import to hash passwords
const bcrypt = require('bcryptjs');

// Import from express-validator
const { validationResult } = require('express-validator');

// Import JWT token generator
const jwt = require('jsonwebtoken');


// POST /api/v1/user/signup
exports.signup = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: true,
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

        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'super-secret-key',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status: true,
            message: 'Login successful',
            token,        // 👈 React needs this
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
