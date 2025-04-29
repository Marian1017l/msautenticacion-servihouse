class signInRequest {
    constructor(userName, password) {
        this.userName = userName;
        this.password = password;
        this.emailNotification = emailNotification;
    }
  
    static validate(data) {
        const { userName, password, emailNotification } = data;
        const errors = [];
  
        if (!userName || userName.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
  
        if (!password || password.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }

        if (emailNotification !== undefined && typeof emailNotification !== 'boolean') {
            errors.push("Email notification must be a boolean value.");
        }
  
        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = signInRequest;