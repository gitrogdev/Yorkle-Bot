export const RESULTS_EMOJIS: Record<string, string> = {
	BEST: '👑',
	STREAK: '🔥'
} as const;

export type ResultEmoji = typeof RESULTS_EMOJIS[
	keyof typeof RESULTS_EMOJIS
];