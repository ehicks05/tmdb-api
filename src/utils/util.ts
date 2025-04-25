export const range = (i: number, j: number) =>
	[...new Array(j - i)].fill(0).map((_, k) => i + k);

export const toParams = (appends?: Record<string, boolean>) =>
	appends && Object.keys(appends).length > 0
		? {
				params: {
					append_to_response: Object.entries(appends || {})
						.filter(([, v]) => v)
						.map(([k]) => k)
						.join(','),
				},
			}
		: undefined;
