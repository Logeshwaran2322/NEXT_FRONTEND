export const validateForm = (
  fields,
  formData,
  skipReadOnly = false
) => {
  const newErrors = {};

  fields.forEach((field) => {
    if (skipReadOnly && field.readOnly) {
      return;
    }

    const value = formData[field.name];

    const error =
      validateRequired(field, value) ||
      validateName(field, value) ||
      validatePath(field, value) ||
      validateNumber(field, value) ||
      validateEmailField(field, value) ||
      validatePassword(field, value) ||
      validatePhoneField(field, value);

    if (error) {
      newErrors[field.name] = error;
    }
  });

  return newErrors;
};

// -------------------------
// Validation functions
// -------------------------

const validateRequired = (field, value) => {
  if (isEmpty(value)) {
    return `${field.label} is required`;
  }

  return null;
};

const validateName = (field, value) => {
  if (field.name !== "name") {
    return null;
  }

  const isValidName = /^[a-zA-Z ]{3,}$/.test(value.trim());

  if (isValidName === false) {
    return "Name must contain at least 3 letters and only alphabets";
  }

  return null;
};

const validatePath = (field, value) => {
  if (field.name !== "path") {
    return null;
  }

  const trimmedValue = value.toString();

  const startsWithSlash =
    trimmedValue.startsWith("/");

  const startsWithSpace =
    trimmedValue.startsWith(" ");

  if (
    startsWithSlash === false ||
    startsWithSpace === true
  ) {
    return "Path must start with '/' and should not start with space";
  }

  return null;
};

const validateNumber = (field, value) => {
  if (
    field.type === "number" &&
    Number(value) < 0
  ) {
    return `${field.label} must be greater than 0`;
  }

  return null;
};

const validateEmailField = (field, value) => {
  if (
    field.type === "email" &&
    !isValidEmail(value)
  ) {
    return "Invalid email format";
  }

  return null;
};

const validatePassword = (field, value) => {
  if (
    field.type === "password" &&
    value.length < 6
  ) {
    return "Password must be at least 6 characters";
  }

  return null;
};

const validatePhoneField = (field, value) => {
  if (
    field.name !== "phoneNo" ||
    !value
  ) {
    return null;
  }

  if (!/^\d+$/.test(value)) {
    return "Phone number must contain only digits";
  }

  if (value.length !== 10) {
    return "Phone number must be exactly 10 digits";
  }

  return null;
};

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" &&
      value.trim() === "") ||
    (Array.isArray(value) &&
      value.length === 0)
  );
};

const isValidEmail = (value) => {
  const email = value.trim();

  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  return (
    atIndex > 0 &&
    dotIndex > atIndex + 1 &&
    dotIndex < email.length - 1 &&
    !email.includes(" ")
  );
};

const isValidPhone = (value) => {
  const phone = value.toString().trim();

  return /^\d{10}$/.test(phone);
};