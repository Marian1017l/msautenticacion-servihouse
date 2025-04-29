const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia de prisma
const bcrypt = require('bcryptjs'); //Importamos bcryptjs para encriptar la contraseña
const jwt = require('jsonwebtoken'); //Importamos jsonwebtoken para generar el token
const signUpRequest = require('../models/signUpRequest'); //Importamos el modelo de signUpRequest
const resendCodeRequest = require('../models/resendCodeRequest'); //Importamos el modelo de resendCodeRequest
const verifyCodeRequest = require('../models/verifyCodeRequest'); //Importamos el modelo de verifyCodeRequest
const signInRequest = require('../models/signInRequest'); //Importamos el modelo de signInRequest
require("dotenv").config(); //Nos permite leer las variables de entorno
const { UserService } = require('../services/user.service'); //Importamos el servicio de usuario
const e = require('express');


const signUp = async (req, res) => {
    if (!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let modelErrors = signUpRequest.validate(req.body); 
    if (modelErrors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: modelErrors
        })
    }
    
    let { userName, email, phone, password, rolName, emailNotification } = req.body; 
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
            OR: [
                { email },
                { userName }
            ]
            }
        });
        if (existingUser) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
        const code = UserService.generateCode(); //Generamos un codigo de verificacion aleatorio
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 15);
        const rol = await prisma.rol.findFirst({
            where: {
                name: rolName
            }
        });
        if (!rol) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Role does not exist"
            });
        }
        const user = await prisma.user.create({
            data: {
                userName,
                email,
                phone,
                password: hashedPassword,
                status: "PENDING",
                rol : {
                    connect: {
                        id: rol.id
                    }
                },
                verificationCode: code, 
                verificationCodeExpiration: expirationTime
            },
        });
        if (emailNotification) {
            UserService.sendVerificationEmail(email, code, userName); 
        }
        else{
            UserService.sendVerificationSMS(phone, code, userName);
        }

        res.status(201).json({
            success: true,
            status: 201,
            message: "User created, please check your email or phone for the verification code"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "User was not created",
            error: error.message
        })
    }
}

const resendVerifyCode = async (req, res) => {
    if (!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let modelErrors = resendCodeRequest.validate(req.body);
    if (modelErrors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: modelErrors
        })
    }
    let { userName, email, phone, emailNotification } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { userName }
                ]
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User does not exist"
            });
        }
        const code = UserService.generateCode(); //Generamos un codigo de verificacion aleatorio
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 15);
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                verificationCode: code,
                verificationCodeExpiration: expirationTime
            }
        });
        if (emailNotification) {
            UserService.sendVerificationEmail(email, code, userName); 
        }
        else{
            UserService.sendVerificationSMS(phone, code, userName);
        }

        res.status(200).json({
            success: true,
            status: 200,
            message: "Verification code resent, please check your email or phone for the verification code"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Er",
            error: error.message
        })
    }
}

const verifyCode = async (req, res) => {
    if (!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let modelErrors = verifyCodeRequest.validate(req.body);
    if (modelErrors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: modelErrors
        })
    }
    let { userName, code } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                 userName 
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User does not exist"
            });
        }
        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid verification code"
            });
        }
        if (user.verificationCodeExpiration < new Date()) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Verification code expired"
            });
        }
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                status: "ACTIVE",
                verificationCode: null,
                verificationCodeExpiration: null
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "User verified successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error verifying user",
            error: error.message
        })
    }
}

const signIn = async (req, res) => {
    if (!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let modelErrors = signInRequest.validate(req.body); 
    if (modelErrors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: modelErrors
        })
    }
    
    let { userName, password, emailNotification } = req.body; 
    try {
        const user = await prisma.user.findFirst({
            where: {
                userName
            }
        });
        if (!user) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User does not exist"
            });
        }
        const matchPassword = await bcrypt.compare(password, user.password); 
        if (!matchPassword) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid password"
            });
        }
        
        if (user.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User is not active"
            });
        }

        let code = UserService.generateCode(); //Generamos un codigo de verificacion aleatorio
        let expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 15);
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                twoFACode: code,
                twoFAExpiration: expirationTime
            }
        });

        if (emailNotification) {
            UserService.send2FAEmail(user.email, code, userName);
        }
        else{
            UserService.send2FASMS(user.phone, code, userName);
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "2FA code sent, please check your email or phone for the verification code",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error signing in",
            error: error.message
        })
    }
}

const resend2FACode = async (req, res) => {
    if (!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let modelErrors = resendCodeRequest.validate(req.body); 
    if (modelErrors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: modelErrors
        })
    }
    
    let { userName, code, emailNotification } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                userName
            }
        });
        if (!user) { 
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User does not exist"
            });
        }
        
        if (user.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User is not active"
            });
        }
        let code = UserService.generateCode(); //Generamos un codigo de verificacion aleatorio
        let expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 15);
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                twoFACode: code,
                twoFAExpiration: expirationTime
            }
        });

        if (emailNotification) {
            UserService.send2FAEmail(user.email, code, userName);
        }
        else{
            UserService.send2FASMS(user.phone, code, userName);
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "2FA code resent, please check your email or phone for the verification code",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error resending 2FA code",
            error: error.message
        })
    }
}

const verify2FACode = async (req, res) => {
    if (!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let modelErrors = verifyCodeRequest.validate(req.body);
    if (modelErrors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: modelErrors
        })
    }
    let { userName, code } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                 userName 
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User does not exist"
            });
        }
        if (user.twoFACode !== code) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid verification code"
            });
        }
        if (user.twoFAExpiration < new Date()) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Verification code expired"
            });
        }
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                twoFACode: null,
                twoFAExpiration: null
            }
        });
        const rolUser = await prisma.rol.findFirst({
            where: {
                id: user.rolId
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "login successfully",
            token: jwt.sign({ 
                id: user.id,
                userName: user.userName,
                email: user.email,
                phone: user.phone,
                permissions: rolUser.permissions
             }, process.env.JWT_SECRET, { expiresIn: '1h' })
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error verifying user",
            error: error.message
        })
    }
}

module.exports = {
    signUp,
    resendVerifyCode,
    verifyCode,
    signIn,
    resend2FACode,
    verify2FACode
};