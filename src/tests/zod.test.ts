import { expect, test } from 'vitest';
import { z } from 'zod/v4';
import { logError } from '../utils/error.js';

test('zod playground', { skip: true }, () => {
	const Foo = z.object({
		foo: z.string(),
	});
	const Bar = z.object({
		bar: z.string(),
	});

	const Baz = Foo.extend(Bar.shape);
	const Buzz = z.object({ ...Foo.shape, ...Bar.shape });

	const obj = {
		foo: 'foo',
		bar: 'bar',
	};

	const { data, error } = Baz.safeParse(obj);
	if (error) {
		console.log(z.prettifyError(error));
		return;
	}
});

test('zodError', { skip: true }, () => {
	const Foo = z.object({
		foo: z.string(),
	});

	const obj = {
		bar: 'bar',
	};

	const { data, error } = Foo.safeParse(obj);
	if (error) {
		console.log('hi');
		console.log(z.prettifyError(error));
		console.log('hi2');
		logError(error);
	}

	expect(error).toBeFalsy();
});
