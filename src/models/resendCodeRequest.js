class resendCodeRequest {
    constructor(userName, email, phone, emailNotification) {
        this.userName = userName;
        this.email = email;
        this.phone = phone;
        this.emailNotification = emailNotification;
    }
  
    static validate(data) {
        const { userName, email, phone, emailNotification } = data;
        const errors = [];
  
        if (!userName || userName.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
  
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            errors.push("Email is invalid.");
        }
  
        if (!phone || phone.length < 10) {
            errors.push("Phone number must be at least 10 digits long.");
        }
  
        
        if (emailNotification !== undefined && typeof emailNotification !== 'boolean') {
            errors.push("Email notification must be a boolean value.");
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = resendCodeRequest;