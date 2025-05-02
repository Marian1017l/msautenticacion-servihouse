class verifyCodeRequest {
    constructor(user_name) {
        this.user_name = user_name;
        this.code = code;
    }
  
    static validate(data) {
        const { user_name, code } = data;
        const errors = [];
  
        if (!user_name || user_name.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
  
        if (!code || code.length < 6) {
            errors.push("Verification code must be at least 6 characters long.");
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = verifyCodeRequest;