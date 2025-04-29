const express = require('express');
const router = express.Router();
const {signUp, resendVerifyCode, verifyCode, signIn, resend2FACode, verify2FACode} = require('../controllers/user.controller');

router.post('/SignUp', signUp);
router.post('/ResendVerifyCode', resendVerifyCode);
router.post('/VerifyCode', verifyCode);
router.post('/SignIn', signIn);
router.post('/Resend2FACode', resend2FACode);
router.post('/Verify2FACode', verify2FACode);

module.exports = router;