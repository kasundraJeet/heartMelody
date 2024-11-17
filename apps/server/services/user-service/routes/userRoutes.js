const express = require('express');
const passport = require('passport');
const { signup, login, forgotPassword, verifyOtp, resetPassword , googleLoginSuccess, facebookLoginSuccess } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failure' }),
    googleLoginSuccess
);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login-failure' }),
    facebookLoginSuccess
);

module.exports = router;
