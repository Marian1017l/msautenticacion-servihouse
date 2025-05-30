class createUserRequest {
    constructor(user_name, email, phone, rol_name, full_name, city, department) {
        this.user_name = user_name;
        this.email = email;
        this.phone = phone;
        this.rol_name = rol_name;
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
  
        if (!rol_name) {
            errors.push("Role name is required.");
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
  
  module.exports = createUserRequest;