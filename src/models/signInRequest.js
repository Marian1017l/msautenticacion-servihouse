class signInRequest {
    constructor(user_name, password) {
        this.user_name = user_name;
        this.password = password;
        this.email_notification = email_notification;
    }
  
    static validate(data) {
        const { user_name, password, email_notification } = data;
        const errors = [];
  
        if (!user_name || user_name.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
  
        if (!password || password.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }

        if (email_notification !== undefined && typeof email_notification !== 'boolean') {
            errors.push("Email notification must be a boolean value.");
        }
  
        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = signInRequest;