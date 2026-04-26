import { HttpStatus } from "../types/http-statuses.types.js";
import { ResultStatus } from "../types/result.code.js";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
	switch (resultCode) {
		case ResultStatus.BadRequest:
			return HttpStatus.BadRequest;
		case ResultStatus.NotFound:
			return HttpStatus.NotFound;
		case ResultStatus.Forbidden:
			return HttpStatus.Forbidden;
		case ResultStatus.Unauthorized:
			return HttpStatus.Unauthorized;
		default:
			return HttpStatus.InternalServerError;
	}
};
