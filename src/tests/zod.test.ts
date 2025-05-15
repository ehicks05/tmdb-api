import { test } from 'vitest';
import { z } from 'zod/v4';

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
