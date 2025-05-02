class resendCodeRequest {
    constructor(user_name, email, phone, email_notification) {
        this.user_name = user_name;
        this.email = email;
        this.phone = phone;
        this.email_notification = email_notification;
    }
  
    static validate(data) {
        const { user_name, email, phone, email_notification } = data;
        const errors = [];
  
        if (!user_name || user_name.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
  
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            errors.push("Email is invalid.");
        }
  
        if (!phone || phone.length < 10) {
            errors.push("Phone number must be at least 10 digits long.");
        }
  
        
        if (email_notification !== undefined && typeof email_notification !== 'boolean') {
            errors.push("Email notification must be a boolean value.");
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = resendCodeRequest;