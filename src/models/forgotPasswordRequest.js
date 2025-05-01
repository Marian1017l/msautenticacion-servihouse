class forgotPasswordRequest {
    constructor(userName, newPassword, hash) {
        this.userName = userName;
        this.newPassword = newPassword;
        this.hash = hash;
    }
  
    static validate(data) {
        const { userName } = data;
        const errors = [];
  
        if (!userName || userName.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
        if (!data.newPassword || data.newPassword.length < 6) {
            errors.push("New password must be at least 6 characters long.");
        }
        if (!data.hash) {
            errors.push("Hash is required.");
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = forgotPasswordRequest;