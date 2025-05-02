class resetpasswordRequest {
    constructor(user_name, old_password, new_password, hash) {
        this.user_name = user_name;
        this.old_password = old_password;
        this.new_password = new_password;
    }
  
    static validate(data) {
        const { user_name } = data;
        const errors = [];
  
        if (!user_name || user_name.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
        
        if (!data.old_password || data.old_password.length < 6) {
            errors.push("Old password must be at least 6 characters long.");
        }

        if (!data.new_password || data.new_password.length < 8 || data.new_password.length > 20 || !/\d/.test(data.new_password) || !/[a-zA-Z]/.test(data.new_password) || !/[!@#$%^&*(),.?":{}|<>]/.test(data.new_password)) {
            errors.push("Password must be between 8 and 20 characters long, contain at least one letter, one number, and one special character.");
        }
  
        if (data.new_password === data.old_password) {
            errors.push("New password must be different from old password.");
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = resetpasswordRequest;