class SendforgotPasswordRequest {
    constructor(user_name, email_notification) {
        this.user_name = user_name;
        this.email_notification = email_notification;
    }
  
    static validate(data) {
        const { user_name } = data;
        const errors = [];
  
        if (!user_name || user_name.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }

        if (!data.email_notification) {
            errors.push("Email notification is required.");
        } else if (typeof data.email_notification !== "boolean") {
            errors.push("Email notification must be a boolean value.");
        }
  
        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = SendforgotPasswordRequest;