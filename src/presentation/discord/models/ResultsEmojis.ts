/**
 * String literal values representing the possible options for emojis to add to
 * the results broadcast message.
 *
 * @author gitrog
 */
export const RESULTS_EMOJIS: Record<string, string> = {
	/** The emoji to add before the highest score. */
	BEST: '👑',

	/** The emoji to repeat based on the length of the guild's streak. */
	STREAK: '🔥'
} as const;

export type ResultEmoji = typeof RESULTS_EMOJIS[
	keyof typeof RESULTS_EMOJIS
];