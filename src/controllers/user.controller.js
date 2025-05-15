const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia de prisma
const bcrypt = require('bcryptjs'); //Importamos bcryptjs para encriptar la contraseña
const jwt = require('jsonwebtoken'); //Importamos jsonwebtoken para generar el token
const signUpRequest = require('../models/signUpRequest'); //Importamos el modelo de signUpRequest
const resendCodeRequest = require('../models/resendCodeRequest'); //Importamos el modelo de resendCodeRequest
const verifyCodeRequest = require('../models/verifyCodeRequest'); //Importamos el modelo de verifyCodeRequest
const signInRequest = require('../models/signInRequest'); //Importamos el modelo de signInRequest
const SendforgotPasswordRequest = require('../models/sendForgotPasswordRequest'); //Importamos el modelo de forgotPasswordRequest
const resetpasswordRequest = require('../models/resetPasswordRequest'); //Importamos el modelo de resetPasswordRequest
const forgotPasswordRequest = require('../models/forgotPasswordRequest'); //Importamos el modelo de forgotPasswordRequest
const verifyToken = require('../middlewares/auth'); //Importamos la validacion del token
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
    
    let { user_name, email, phone, password, rol_name, email_notification, full_name, city, department} = req.body; 
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
            OR: [
                { email },
                { user_name }
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
                name: rol_name
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
                user_name,
                email,
                full_name : full_name,
                phone,
                password: hashedPassword,
                status: "PENDING",
                rol : {
                    connect: {
                        id: rol.id
                    }
                },
                city,
                department,
                verification_code: code, 
                verification_code_expiration: expirationTime
            },
        });
        if (email_notification) {
            UserService.sendVerificationEmail(email, code, user_name); 
        }
        else{
            UserService.sendVerificationSMS(phone, code, user_name);
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
    let { user_name, email, phone, email_notification } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { user_name }
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
                verification_code: code,
                verification_code_expiration: expirationTime
            }
        });
        if (email_notification) {
            UserService.sendVerificationEmail(email, code, user_name); 
        }
        else{
            UserService.sendVerificationSMS(phone, code, user_name);
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
    let { user_name, code } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                 user_name 
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User does not exist"
            });
        }
        if (user.verification_code !== code) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid verification code"
            });
        }
        if (user.verification_code_expiration < new Date()) {
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
                verification_code: null,
                verification_code_expiration: null
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
    
    let { user_name, password, email_notification } = req.body; 
    try {
        const user = await prisma.user.findFirst({
            where: {
                user_name
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
                two_fa_code: code,
                two_fa_expiration: expirationTime
            }
        });

        if (email_notification) {
            UserService.send2FAEmail(user.email, code, user_name);
        }
        else{
            UserService.send2FASMS(user.phone, code, user_name);
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
    
    let { user_name, email_notification } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                user_name
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
                two_fa_code: code,
                two_fa_expiration: expirationTime
            }
        });

        if (email_notification) {
            UserService.send2FAEmail(user.email, code, user_name);
        }
        else{
            UserService.send2FASMS(user.phone, code, user_name);
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
    let { user_name, code } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                 user_name 
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "User does not exist"
            });
        }
        if (user.two_fa_code !== code) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid verification code"
            });
        }
        if (user.two_fa_expiration < new Date()) {
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
                two_fa_code: null,
                two_fa_expiration: null
            }
        });
        const rolUser = await prisma.rol.findFirst({
            where: {
                id: user.rol_id
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "login successfully",
            token: jwt.sign({ 
                id: user.id,
                user_name: user.user_name,
                email: user.email,
                phone: user.phone,
                permissions: rolUser.permissions,
                rol: rolUser.name,
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


const sendforgotPassword = async (req, res) => {
    if(!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let errors = SendforgotPasswordRequest.validate(req.body);
    if(errors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: errors
        })
    }
    let {user_name, email_notification} = req.body;
    const user = await prisma.user.findFirst({
        where: {
            user_name
        }
    });
    if(!user) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "User does not exist"
        })
    }
    //generar un hash para link de restablecimiento de contraseña
    const hash = await bcrypt.hash(user_name, 10);
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 60);
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            reset_password_hash: hash,
            reset_password_expiration: expirationTime
        }
    });
    
    if(email_notification) {
        UserService.sendForgotPasswordEmail(user.email, hash, user_name);
    } 
    else
    {
        UserService.sendForgotPasswordSMS(user.phone, hash, user_name); 
    }
    res.status(200).json({
        success: true,
        status: 200,
        message: "Reset password link sent, please check your email or phone for the link"
    })
}

const sendresetPassword = async (req, res) => {
    if(!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let errors = forgotPasswordRequest.validate(req.body);
    if(errors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: errors
        })
    }
    let {user_name, email_notification} = req.body;
    const user = await prisma.user.findFirst({
        where: {
            user_name
        }
    });
    if(!user) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "User does not exist"
        })
    }
    const hash = await bcrypt.hash(user_name, 10);
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 60);
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            reset_password_hash: hash,
            reset_password_expiration: expirationTime
        }
    });
    
    if(email_notification) {
        UserService.sendRestorePasswordEmail(user.email, hash, user_name);
    } 
    else
    {
        UserService.sendRestorePasswordSMS(user.phone, hash, user_name); 
    }
    res.status(200).json({
        success: true,
        status: 200,
        message: "Reset password link sent, please check your email or phone for the link"
    })
}

const resetpassword = async (req, res) => {
    const { message, success } = verifyToken(req, 'restorePassword'); 
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
    let errors = resetpasswordRequest.validate(req.body);
    if(errors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: errors
        })
    }
    let {user_name, old_password, new_password} = req.body;
    const user = await prisma.user.findFirst({
        where: {
            user_name
        }
    });
    if(!user) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "User does not exist"
        })
    }
    let token = req.headers['authorization']?.split(' ')[1];
    user_name = jwt.decode(token).user_name;
    if(user.user_name !== user_name) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "User does not match token"
        })
    }
    const matchPassword = await bcrypt.compare(old_password, user.password);
    if(!matchPassword) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Old password is incorrect"
        })
    }
    const hashedPassword = await bcrypt.hash(new_password, 10); 
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword,
            reset_password_hash: null,
            reset_password_expiration: null
        }
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: "Password reset successfully"
    })
}

const forgotpassword = async (req, res) => {
    if(!req.body) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let errors = forgotPasswordRequest.validate(req.body);
    if(errors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: errors
        })
    }
    let {user_name, new_password, hash} = req.body;
    const user = await prisma.user.findFirst({
        where: {
            user_name
        }
    });
    if(!user) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "User does not exist"
        })
    }
    const matchHash = hash === user.reset_password_hash;
    if(!matchHash) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Invalid hash"
        })
    }
    if(user.reset_password_expiration < new Date()) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Hash expired"
        })
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword,
            reset_password_hash: null,
            reset_password_expiration: null
        }
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: "Password reset successfully"
    })
}

const getUserById = async (req, res) => {
    const { id } = req.params; 
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "User found",
            data: {
                id: user.id,
                user_name: user.user_name,
                email: user.email,
                phone: user.phone,
                status: user.status,
                rol : await prisma.rol.findFirst({
                    where: {
                        id: user.rol_id
                    }
                })

            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error getting user",
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
    verify2FACode,
    sendresetPassword,
    sendforgotPassword,
    resetpassword,
    forgotpassword,
    getUserById
};