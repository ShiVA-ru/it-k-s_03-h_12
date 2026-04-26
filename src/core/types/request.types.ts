import type { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, Q> = Request<T, {}, Q>;
export type RequestWithUserId<T> = Request<{}, {}, {}, T>;
export type RequestWithParamsBodyUserId<T, Q, Z> = Request<T, {}, Q, Z>;
export type RequestWithParamsUserId<T, Q> = Request<T, {}, {}, Q>;
