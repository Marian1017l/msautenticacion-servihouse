const express = require('express');
const router = express.Router();
const {getDepartments, getCitiesByDepartment
} = require('../controllers/utilities.controller');

router.get('/departments/getAll', getDepartments);
router.get('/cities/:department', getCitiesByDepartment);

module.exports = router;