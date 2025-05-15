const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const rolRoutes = require('./rol.routes');
const utilitiesRoutes = require('./utilities.routes');

router.use('/user', userRoutes);
router.use('/rol', rolRoutes);
router.use('/utilities', utilitiesRoutes);


module.exports = router;