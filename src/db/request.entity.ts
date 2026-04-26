import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";

export type Request = {
	ip: string;
	url: string;
	date: Date;
};

type RequestModel = Model<Request>;

export type RequestDocument = HydratedDocument<Request>;

const RequestSchema = new mongoose.Schema<Request>({
	ip: { type: String, trim: true, required: true },
	url: { type: String, trim: true, required: true },
	date: { type: Date, default: Date.now },
});

export const RequestModel = model<Request, RequestModel>(
	"Request",
	RequestSchema,
);
