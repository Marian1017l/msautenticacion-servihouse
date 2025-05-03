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


        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = resendCodeRequest;