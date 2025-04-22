import { test } from 'vitest';
import z from 'zod';

test('zod playground', { skip: true }, () => {
	const Schema = z.object({
		date: z.date(),
		stringDate: z.iso.date(),
		stringDateTime: z.iso.datetime(),
		stringTime: z.iso.time(),
	});
	type foo = z.infer<typeof Schema>;

	const obj = {
		date: new Date(),
		stringDate: '2024-12-01',
		stringDateTime: '2024-12-01T15:12:05.123Z',
		stringTime: '15:12:05.123',
	};

	const { data, error } = Schema.safeParse(obj);
	if (error) {
		console.log(z.prettifyError(error));
		return;
	}
});
