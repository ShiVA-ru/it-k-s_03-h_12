export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,

  InternalServerError = 500,
}

type HttpStatusKeys = keyof typeof HttpStatus;

export type HttpStatusType = (typeof HttpStatus)[HttpStatusKeys];
