import type { ResultStatus } from "./result.code.js";

type ExtensionType = {
	field: string | null;
	message: string;
};

export type SuccessResult<T> = {
	status: ResultStatus.Success;
	data: T;
	extensions: [];
};

export type ErrorResult = {
	status: Exclude<ResultStatus, ResultStatus.Success>;
	errorMessage: string;
	data: null;
	extensions: ExtensionType[];
};

export type Result<T> = SuccessResult<T> | ErrorResult;
