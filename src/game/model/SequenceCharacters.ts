import { GuessResult } from './GuessResult.js';
import { SkipResult } from './SkipResult.js';

/**
 * String literal values representing the possible options for characters to add
 * to guess sequences to save to file.
 *
 * @author gitrog
 */
export const SEQUENCE_CHARACTERS: Record<GuessResult | SkipResult, string> = {
	/** The guess matches the correct answer. */
	[GuessResult.Correct]: 'O',

	/** The player skipped the provided clip. */
	[SkipResult.Skip]: '-',

	/** The guess is valid but does not match the correct answer. */
	[GuessResult.Incorrect]: 'X',

	/**
	 * The guess is valid but incorrect, and the player has reached the maximum
	 * number of allowed guesses, ending the game session.
	 * */
	[GuessResult.OutOfGuesses]: 'X',

	/**
	 * The guess is not recognized by the game.
	 */
	[GuessResult.Invalid]: '',

	/**
	 * The guess is valid but has already been submitted.
	 */
	[GuessResult.Repeat]: '',

	/**
	 * The player attempted to skip the last clip in the puzzle.
	 */
	[SkipResult.Last]: ''
} as const;

export type SequenceCharacter = typeof SEQUENCE_CHARACTERS[
	keyof typeof SEQUENCE_CHARACTERS
];