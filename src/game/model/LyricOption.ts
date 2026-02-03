export const LyricOption = {
	Lyric: 'LYRIC',
	Judgement: 'JUDGEMENT'
} as const;

export type LyricOption = typeof LyricOption[keyof typeof LyricOption];