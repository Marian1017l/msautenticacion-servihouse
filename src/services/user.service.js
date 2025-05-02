const generateApiToken = require("../middlewares/tokenGenerate");

class UserService{
    sendVerificationEmail = async (email, verification_code, full_name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/email/VerifyCode";
        const token = generateApiToken();
        const data = {
            email: email,
            code: verification_code,
            name: full_name
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
    
    sendVerificationSMS = async (phone, verification_code, full_name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/message/VerifyCode";
        const token = generateApiToken();
        const data = {
            phone: phone,
            code: verification_code,
            name: full_name
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

    send2FAEmail = async (email, verification_code, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/email/2FACode";
        const token = generateApiToken();
        const data = {
            email: email,
            code: verification_code,
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

    send2FASMS = async (phone, verification_code, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/message/2FACode";
        const token = generateApiToken();
        const data = {
            phone: phone,
            code: verification_code,
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