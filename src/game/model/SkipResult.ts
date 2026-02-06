/**
 * String literal values representing the possible outcomes of attempting to
 * skip a clip.
 *
 * @author gitrog
 */
export const SkipResult = {
	/** The clip was skipped successfully. */
	Skip: 'SKIP',

	/**
	 * The clip cannot be skipped, because it is the last clip in the puzzle.
	 */
	Last: 'LAST'
} as const;

export type SkipResult = typeof SkipResult[keyof typeof SkipResult];