export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {

  if (!error) {
    return fallback;
  }


  const responseData =
    error?.response?.data;


  if (
    typeof responseData === "string" &&
    responseData.trim()
  ) {

    return responseData;

  }


  if (
    responseData?.message
  ) {

    return responseData.message;

  }


  if (
    responseData?.error
  ) {

    return responseData.error;

  }


  if (
    Array.isArray(
      responseData?.errors
    ) &&
    responseData.errors.length > 0
  ) {

    const firstError =
      responseData.errors[0];


    if (
      typeof firstError === "string"
    ) {

      return firstError;

    }


    if (
      firstError?.message
    ) {

      return firstError.message;

    }

  }


  if (
    error?.message
  ) {

    return error.message;

  }


  return fallback;
};


export const isUnauthorized =
  error => {

    return (
      error?.response?.status === 401
    );

  };


export const isForbidden =
  error => {

    return (
      error?.response?.status === 403
    );

  };


export const isValidationError =
  error => {

    return (
      error?.response?.status === 400 ||
      error?.response?.status === 422
    );

  };