class resetpasswordRequest {
    constructor(userName, oldPassword, newPassword, hash) {
        this.userName = userName;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.hash = hash;
    }
  
    static validate(data) {
        const { userName } = data;
        const errors = [];
  
        if (!userName || userName.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
        
        if (!data.oldPassword || data.oldPassword.length < 6) {
            errors.push("Old password must be at least 6 characters long.");
        }

        if (!data.newPassword || data.newPassword.length < 6) {
            errors.push("New password must be at least 6 characters long.");
        }

        if (!data.hash) {
            errors.push("Hash is required.");
        }
        if (data.newPassword === data.oldPassword) {
            errors.push("New password must be different from old password.");
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = resetpasswordRequest;