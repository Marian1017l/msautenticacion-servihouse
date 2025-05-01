class createRolRequest {
    constructor(name, description, permissions) {
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }
    static validate(data) {
        const errors = [];
  
        if (!data.name || typeof data.name !== 'string') {
            errors.push('Name is required and must be a string.');
        }
        if (!data.description || typeof data.description !== 'string') {
            errors.push('Description is required and must be a string.');
        }
        if (!data.permissions || !Array.isArray(data.permissions)) {
            errors.push('Permissions are required and must be an array.');
        } else {
            data.permissions.forEach((permission, index) => {
                if (typeof permission !== 'string') {
                    errors.push(`Permission at index ${index} must be a string.`);
                }
            });
        }

        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = createRolRequest;