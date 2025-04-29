class verifyCodeRequest {
    constructor(userName) {
        this.userName = userName;
        this.code = code;
    }
  
    static validate(data) {
        const { userName, code } = data;
        const errors = [];
  
        if (!userName || userName.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
  
        if (!code || code.length < 6) {
            errors.push("Verification code must be at least 6 characters long.");
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = verifyCodeRequest;