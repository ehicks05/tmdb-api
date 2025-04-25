import z, { ZodError } from 'zod';

interface FetchErrorInfo {
	path: string;
	params?: Record<string, string | number | boolean>;
}

export class FetchError extends Error {
	info;

	constructor(message: string, info: FetchErrorInfo) {
		super(message);
		this.info = info;
	}
}

export const logError = (error: unknown) => {
	if (error instanceof ZodError) {
		console.log(z.prettifyError(error));
	}
	if (error instanceof FetchError) {
		console.log(`${error.message}: ${error.info}`);
	}
};
