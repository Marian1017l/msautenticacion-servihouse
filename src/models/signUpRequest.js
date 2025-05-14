class signUpRequest {
    constructor(user_name, email, phone, password, rol_name, email_notification, full_name, city, department) {
        this.user_name = user_name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.rol_name = rol_name;
        this.email_notification = email_notification;
        this.full_name = full_name;
        this.city = city;
        this.department = department;
    }
  
    static validate(data) {
        const { user_name, email, phone, password, rol_name, email_notification, city, department} = data;
        const errors = [];
  
        if (!user_name || user_name.length < 5) {
            errors.push("User name must be at least 5 characters long.");
        }
  
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            errors.push("Email is invalid.");
        }
  
        if (!phone || phone.length < 10) {
            errors.push("Phone number must be at least 10 digits long.");
        }
            
        if (!password || password.length < 8 || password.length > 20 || !/\d/.test(password) || !/[a-zA-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("Password must be between 8 and 20 characters long, contain at least one letter, one number, and one special character.");
        }
  
        if (!rol_name) {
            errors.push("Role name is required.");
        }
        
        if (email_notification !== undefined && typeof email_notification !== 'boolean') {
            errors.push("Email notification must be a boolean value.");
        }

        if (!data.full_name || data.full_name.length < 5) {
            errors.push("Full name must be at least 5 characters long.");
        }
        if (!city || city.length < 3) {
            errors.push("City must be at least 3 characters long.");
        }
        if (!department || department.length < 3) {
            errors.push("Department must be at least 3 characters long.");
        }
        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = signUpRequest;