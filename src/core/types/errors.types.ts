export type validationErrorType = {
  field: string | null;
  message: string | null;
};

export type validationErrorsDto = {
  errorsMessages: validationErrorType[] | null;
};
