/**
 * String literal values representing the possible localization keys for a hint.
 *
 * @author gitrog
 */
export const HintOption = {
	/** The guessed song is on the same album as another song. */
	Album: 'hints.samealbum',

	/** The guessed song is by the same artist as another song. */
	Artist: 'hints.sameartist',

	/** The guessed song was released at least ten years from another song. */
	DiffDecade: 'hints.diffdecade',

	/** The guessed song was released within 2-4 years of another song. */
	DiffFew: 'hints.difffew',

	/** The guessed song was released within a year of another song. */
	DiffOne: 'hints.diffone',

	/** The guessed song was released the same year as another song. */
	DiffSame: 'hints.diffsame',

	/** The guessed song was released within 5-9 years of another song. */
	DiffSeveral: 'hints.diffseveral',

	/** The guessed song is longer than another song. */
	Longer: 'hints.longerthan',

	/** The guessed song is shorter than another song. */
	Shorter: 'hints.shorterthan'
} as const;

export type HintOption = typeof HintOption[keyof typeof HintOption];