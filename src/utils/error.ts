import z from 'zod/v4';

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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function instanceOfZodError(object: any): object is z.ZodError {
	return 'issues' in object;
}

export const logError = (error: unknown) => {
	if (instanceOfZodError(error)) {
		console.log(z.prettifyError(error));
	} else if (error instanceof FetchError) {
		console.log(`${error.message}: ${error.info}`);
	} else console.log(error);
};
