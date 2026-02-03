export const SkipResult = {
	Skip: 'SKIP',
	Last: 'LAST'
} as const;

export type SkipResult = typeof SkipResult[keyof typeof SkipResult];