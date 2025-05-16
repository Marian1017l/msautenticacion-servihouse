const express = require('express');
const router = express.Router();
const {signUp, resendVerifyCode, verifyCode, signIn, resend2FACode, verify2FACode,
    sendresetPassword, sendforgotPassword, resetpassword, forgotpassword, getUserById, getAllUsers
} = require('../controllers/user.controller');

router.post('/SignUp', signUp);
router.post('/ResendVerifyCode', resendVerifyCode);
router.post('/VerifyCode', verifyCode);
router.post('/SignIn', signIn);
router.post('/Resend2FACode', resend2FACode);
router.post('/Verify2FACode', verify2FACode);
router.post('/SendResetPassword', sendresetPassword);
router.post('/SendForgotPassword', sendforgotPassword);
router.post('/ResetPassword', resetpassword);
router.post('/ForgotPassword', forgotpassword);
router.get('/GetUserById/:id', getUserById);
router.get('/GetAllUsers', getAllUsers);

module.exports = router;