const express = require('express');
const router = express.Router();

//import controller functions
const { signup, login } = require('../controllers/userController');
const { body } = require('express-validator');

// POST /api/v1/user/signup
router.post(
    '/signup',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters')
    ],
    signup
);

// POST /api/v1/user/login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    login
);

module.exports = router;