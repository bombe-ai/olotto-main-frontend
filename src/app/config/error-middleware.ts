interface FieldError {
  field: string;
  objectName: string;
  message: string;
}

interface ErrorData {
  message: string;
  fieldErrors?: FieldError[];
}

const getErrorMessage = (errorData: ErrorData) => {
  let { message } = errorData;
  if (errorData.fieldErrors) {
    errorData.fieldErrors.forEach((fErr: FieldError) => {
      message += `\nfield: ${fErr.field},  Object: ${fErr.objectName}, message: ${fErr.message}\n`;
    });
  }
  return message;
};

export default () => (next: any) => (action: any) => {
  /**
   *
   * The error middleware serves to log error messages from dispatch
   * It need not run in production
   */
  if (import.meta.env.VITE_DEVELOPMENT) {
    const { error } = action;
    if (error) {
      console.error(
        `${action.type} caught at middleware with reason: ${JSON.stringify(
          error.message
        )}.`
      );
      if (error.response && error.response.data) {
        const message = getErrorMessage(error.response.data);
        console.error(`Actual cause: ${message}`);
      }
    }
  }
  // Dispatch initial action
  return next(action);
};
