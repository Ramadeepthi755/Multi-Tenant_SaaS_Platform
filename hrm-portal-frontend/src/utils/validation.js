export const required = (
  value,
  fieldName = "This field"
) => {

  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {

    return `${fieldName} is required.`;

  }


  return "";
};


export const email = (
  value
) => {

  if (!value) {
    return "";
  }


  const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (
    !pattern.test(
      String(value).trim()
    )
  ) {

    return "Please enter a valid email address.";

  }


  return "";
};


export const minLength = (
  value,
  length,
  fieldName = "This field"
) => {

  if (!value) {
    return "";
  }


  if (
    String(value).length <
    length
  ) {

    return `${fieldName} must contain at least ${length} characters.`;

  }


  return "";
};


export const maxLength = (
  value,
  length,
  fieldName = "This field"
) => {

  if (!value) {
    return "";
  }


  if (
    String(value).length >
    length
  ) {

    return `${fieldName} must not exceed ${length} characters.`;

  }


  return "";
};


export const phone = (
  value
) => {

  if (!value) {
    return "";
  }


  const pattern =
    /^[6-9]\d{9}$/;


  if (
    !pattern.test(
      String(value).trim()
    )
  ) {

    return "Please enter a valid 10-digit mobile number.";

  }


  return "";
};


export const password = (
  value
) => {

  if (!value) {
    return "";
  }


  if (
    value.length < 8
  ) {

    return "Password must contain at least 8 characters.";

  }


  return "";
};


export const confirmPassword = (
  passwordValue,
  confirmValue
) => {

  if (!confirmValue) {
    return "";
  }


  if (
    passwordValue !==
    confirmValue
  ) {

    return "Passwords do not match.";

  }


  return "";
};


export const composeErrors = (
  validators
) => {

  for (
    const validator of validators
  ) {

    const error =
      validator();


    if (error) {
      return error;
    }

  }


  return "";
};