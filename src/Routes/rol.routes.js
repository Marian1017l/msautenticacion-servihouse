const express = require('express');
const router = express.Router();
const {createRol, getAllRols, getRolById, updateRol, deleteRol
} = require('../controllers/rol.controller');

router.post('/Create', createRol);
router.get('/GetAll', getAllRols);
router.get('/GetById/:id', getRolById);
router.put('/Update/:id', updateRol);
router.delete('/Delete/:id', deleteRol);

module.exports = router;