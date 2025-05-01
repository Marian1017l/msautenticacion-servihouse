const generateApiToken = require("../middlewares/tokenGenerate");

class UserService{
    sendVerificationEmail = async (email, verificationCode, fullname) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/email/VerifyCode";
        const token = generateApiToken();
        const data = {
            email: email,
            code: verificationCode,
            name: fullname
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        console.log("Email sent", response.status);
    }
    
    sendVerificationSMS = async (phone, verificationCode, fullname) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/message/VerifyCode";
        const token = generateApiToken();
        const data = {
            phone: phone,
            code: verificationCode,
            name: fullname
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
    }
    
    generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); //Generamos un codigo de verificacion aleatorio
    }

    send2FAEmail = async (email, verificationCode, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/email/2FACode";
        const token = generateApiToken();
        const data = {
            email: email,
            code: verificationCode,
            name: name
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    send2FASMS = async (phone, verificationCode, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/message/2FACode";
        const token = generateApiToken();
        const data = {
            phone: phone,
            code: verificationCode,
            name: name
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    sendRestorePasswordEmail = async (email, hash, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/email/RestorePassword";
        const token = generateApiToken();
        const data = {
            email: email,
            hash: process.env.FRONTEND_URL + "/auth/forgotpassword" + hash,
            name: name
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    sendRestorePasswordSMS = async (phone, hash, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/message/RestorePassword";
        const token = generateApiToken();
        const data = {
            phone: phone,
            hash: process.env.FRONTEND_URL + "/auth/forgotpassword" + hash,
            name: name
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    sendForgotPasswordEmail = async (email, hash, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/email/ForgotPassword";
        const token = generateApiToken();
        const data = {
            email: email,
            hash: process.env.FRONTEND_URL + "/auth/forgotpassword" + hash,
            name: name
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    sendForgotPasswordSMS = async (phone, hash, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/message/ForgotPassword";
        const token = generateApiToken();
        const data = {
            phone: phone,
            hash: process.env.GATEWAY_URLL + "/auth/forgotpassword" + hash,
            name: name
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
    }

}


module.exports = {
    UserService: new UserService(),
};