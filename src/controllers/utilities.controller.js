const express = require('express');
require('dotenv').config();
const dataDeparments = require('../utilities/json/colombia.json');

const getDepartments = async (req, res) => {
    const departamentos = Object.keys(dataDeparments);
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Departments retrieved successfully',
        data: departamentos
    });
}

const getCitiesByDepartment = async (req, res) => { 
    let { department } = req.params;
    department = decodeURIComponent(department);
    const cities = dataDeparments[department];
    if (!cities) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: 'Department not found',
            data: null
        });
    }
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Cities retrieved successfully',
        data: cities
    });
}

module.exports = {
    getDepartments,
    getCitiesByDepartment
}