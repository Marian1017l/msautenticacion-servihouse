const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia de prisma
const bcrypt = require('bcryptjs'); //Importamos bcryptjs para encriptar la contraseña
const jwt = require('jsonwebtoken'); //Importamos jsonwebtoken para generar el token
require("dotenv").config(); //Nos permite leer las variables de entorno
const verifyToken = require('../middlewares/auth'); //Importamos la validacion del token
const createRolRequest = require('../models/createRolRequest'); //Importamos la validacion del rol
const express = require('express');

const createRol = async (req, res) => {
    try {
        const { message, success } = verifyToken(req, 'createRol'); 
        if (!success) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: message
            });
        }
        if(!req.body) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Request body is required"
            })
        }
        let errors = createRolRequest.validate(req.body);
        const { name, description, permissions } = req.body; 
        if (errors) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: errors
            });
        }
        const rol = await prisma.rol.create({ 
            data: {
                name: name, 
                description: description, 
                permissions: permissions, 
            },
        });
        if (!rol) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Rol not created"
            });
        }
        res.status(201).json({ 
            success: true,
            status: 201,
            message: "Rol created successfully",
            data: rol
        });
    } catch (error) {
        console.error("Error creating rol:", error); 
        res.status(500).json({ 
            success: false,
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAllRols = async (req, res) => {
    try {
        const { message, success } = verifyToken(req, 'getAllRols'); 
        if (!success) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: message
            });
        }
        const rols = await prisma.rol.findMany(); 
        if (!rols) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Rols not found"
            });
        }
        res.status(200).json({ 
            success: true,
            status: 200,
            message: "Rols found successfully",
            data: rols
        });
    } catch (error) {
        console.error("Error getting rols:", error); 
        res.status(500).json({ 
            success: false,
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
}

const getRolById = async (req, res) => {
    try {
        const { message, success } = verifyToken(req, 'getRolById'); 
        if (!success) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: message
            });
        }
        const { id } = req.params; 
        const rol = await prisma.rol.findUnique({ 
            where: {
                id: id, 
            },
        });
        if (!rol) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Rol not found"
            });
        }
        res.status(200).json({ 
            success: true,
            status: 200,
            message: "Rol found successfully",
            data: rol
        });
    } catch (error) {
        console.error("Error getting rol:", error); 
        res.status(500).json({ 
            success: false,
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
}

const updateRol = async (req, res) => {
    try {
        const { message, success } = verifyToken(req, 'updateRol'); 
        if (!success) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: message
            });
        }
        const { id } = req.params; 
        let errors = createRolRequest.validate(req.body);
        if (errors) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: errors
            });
        }
        const { name, description, permissions } = req.body;
        const rol = await prisma.rol.update({ 
            where: {
                id: id, 
            },
            data: {
                name: name, 
                description: description, 
                permissions: permissions, 
            },
        });
        if (!rol) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Rol not updated"
            });
        }
        res.status(200).json({ 
            success: true,
            status: 200,
            message: "Rol updated successfully",
            data: rol
        });
    } catch (error) {
        console.error("Error updating rol:", error); 
        res.status(500).json({ 
            success: false,
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
}

const deleteRol = async (req, res) => {
    try {
        const { message, success } = verifyToken(req, 'deleteRol'); 
        if (!success) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: message
            });
        }
        const { id } = req.params; 
        const userHasRol = await prisma.user.findMany({
            where: {
                rolId: id, 
            },
        });
        if (userHasRol.length > 0) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Rol cannot be deleted because it is assigned to a user"
            });
        }
        const rol = await prisma.rol.delete({ 
            where: {
                id: id, 
            },
        });
        if (!rol) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Rol not deleted"
            });
        }
        res.status(200).json({ 
            success: true,
            status: 200,
            message: "Rol deleted successfully",
            data: rol
        });
    } catch (error) {
        console.error("Error deleting rol:", error); 
        res.status(500).json({ 
            success: false,
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports = {
    createRol, getAllRols, getRolById, updateRol, deleteRol
};