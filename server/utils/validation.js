const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const validateUserInput = ({ name, email, password, address, role }, { requirePassword = true, allowedRoles = null } = {}) => {
  const errors = [];

  if (!name || name.length < 20 || name.length > 60) {
    errors.push('Name must be between 20 and 60 characters.');
  }

  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (requirePassword && (!password || !passwordRegex.test(password))) {
    errors.push('Password must be 8-16 characters and include at least one uppercase letter and one special character.');
  }

  if (address && address.length > 400) {
    errors.push('Address must not exceed 400 characters.');
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    errors.push('Please provide a valid role.');
  }

  return errors;
};

const validateStoreInput = ({ name, email, address, ownerEmail }) => {
  const errors = [];

  if (!name || name.length < 1 || name.length > 60) {
    errors.push('Store name must be between 1 and 60 characters.');
  }

  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid store email address.');
  }

  if (!address || address.length > 400) {
    errors.push('Store address is required and must not exceed 400 characters.');
  }

  if (!ownerEmail || !emailRegex.test(ownerEmail)) {
    errors.push('Please provide a valid owner email address.');
  }

  return errors;
};

module.exports = {
  passwordRegex,
  validateStoreInput,
  validateUserInput,
};
