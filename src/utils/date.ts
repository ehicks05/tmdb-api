export type Interval = { start: Date; end: Date };

export const format = (date: Date) =>
	[
		date.getFullYear(),
		`0${date.getMonth() + 1}`.slice(-2),
		`0${date.getDate()}`.slice(-2),
	].join('-');

export const subDays = (date: Date, i: number) =>
	new Date(date.setDate(date.getDate() - i));

export const lastDayOfYear = (date: Date) =>
	new Date(new Date(date.setMonth(11, 31)).setHours(0, 0, 0));

export const eachYearOfInterval = (i: Interval) => {
	const startYear = i.start.getFullYear();
	const endYear = i.end.getFullYear();
	const years = endYear - startYear + 1;

	return [...new Array(years)].fill(0).map((_, i) => new Date(startYear + i, 0));
};
