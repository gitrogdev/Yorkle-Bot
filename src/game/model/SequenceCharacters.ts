import type { GuessResult } from './GuessResult.js';
import type { SkipResult } from './SkipResult.js';

/**
 * String literal values representing the possible options for characters to add
 * to guess sequences to save to file.
 *
 * @author gitrog
 */
export const SEQUENCE_CHARACTERS: Record<GuessResult | SkipResult, string> = {
	/** The guess matches the correct answer. */
	CORRECT: 'O',

	/** The player skipped the provided clip. */
	SKIP: '-',

	/** The guess is valid but does not match the correct answer. */
	INCORRECT: 'X',

	/**
	 * The guess is valid but incorrect, and the player has reached the maximum
	 * number of allowed guesses, ending the game session.
	 * */
	NOGUESSES: 'X',

	/**
	 * The guess is not recognized by the game.
	 */
	INVALID: '',

	/**
	 * The guess is valid but has already been submitted.
	 */
	REPEAT: '',

	/**
	 * The player attempted to skip the last clip in the puzzle.
	 */
	LAST: ''
} as const;

export type SequenceCharacter = typeof SEQUENCE_CHARACTERS[
	keyof typeof SEQUENCE_CHARACTERS
];