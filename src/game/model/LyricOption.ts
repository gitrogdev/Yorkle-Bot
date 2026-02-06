/**
 * String literal values representing the possible options for lyric archives to
 * pull from.
 *
 * @author gitrog
 */
export const LyricOption = {
	/** The archive containing all song lyrics known by the bot. */
	Lyric: 'LYRIC',

	/**
	 * The archive containing song lyrics selected for "8-ball" style responses.
	 */
	Judgement: 'JUDGEMENT'
} as const;

export type LyricOption = typeof LyricOption[keyof typeof LyricOption];