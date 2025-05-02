class forgotPasswordRequest {
    constructor(user_name, new_password, hash) {
        this.user_name = user_name;
        this.new_password = new_password;
        this.hash = hash;
    }
  
    static validate(data) {
        const { user_name } = data;
        const errors = [];
  
        if (!user_name || user_name.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
        if (!data.new_password || data.new_password.length < 6) {
            errors.push("New password must be at least 6 characters long.");
        }
        if (!data.hash) {
            errors.push("Hash is required.");
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = forgotPasswordRequest;