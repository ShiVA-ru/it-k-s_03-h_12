import { ResultStatus } from "../types/result.code.js";
import type { Result, SuccessResult } from "../types/result.type.js";

export function isSuccessResult<T>(
	result: Result<T | null>,
): result is SuccessResult<T> {
	return result.status === ResultStatus.Success;
}
