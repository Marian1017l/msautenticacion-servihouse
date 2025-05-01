const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const rolRoutes = require('./rol.routes');


router.use('/user', userRoutes);
router.use('/rol', rolRoutes);


module.exports = router;