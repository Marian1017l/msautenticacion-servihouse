class SendforgotPasswordRequest {
    constructor(userName, emailNotification) {
        this.userName = userName;
        this.emailNotification = emailNotification;
    }
  
    static validate(data) {
        const { userName } = data;
        const errors = [];
  
        if (!userName || userName.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }

        if (!data.emailNotification) {
            errors.push("Email notification is required.");
        } else if (typeof data.emailNotification !== "boolean") {
            errors.push("Email notification must be a boolean value.");
        }
  
        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = SendforgotPasswordRequest;