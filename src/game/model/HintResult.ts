/**
 * String literal values representing the possible outcomes of a hint.
 *
 * @author gitrog
 */
export const HintResult = {
	/** A hint has been successfully given to the player. */
	Hinted: 'HINT',

	/**
	 * A hint was unable to be given to the player, because they must make a
	 * guess before getting a hint.
	 */
	First: 'FIRST',

	/**
	 * A hint was unable to be given to the player, because they must take a
	 * guess in between requesting hints.
	 */
	Double: 'DOUBLE',

	/**
	 * A hint was unable to be given to the player, because they are on their
	 * last guess.
	 */
	Last: 'LAST'
} as const;

export type HintResult = typeof HintResult[keyof typeof HintResult];