/**
 * String literal values representing the possible outcomes of a guess.
 *
 * @author gitrog
 */
export const GuessResult = {
	/** The guess matches the correct answer. */
	Correct: 'CORRECT',

	/** The guess is valid but does not match the correct answer. */
	Incorrect: 'INCORRECT',

	/**
	 * The guess is valid but incorrect, and the player has reached the maximum
	 * number of allowed guesses, ending the game session.
	 */
	OutOfGuesses: 'NOGUESSES',

	/**
	 * The guess is valid but has already been submitted.
	 */
	Repeat: 'REPEAT',

	/**
	 * The guess is not recognized by the game.
	 */
	Invalid: 'INVALID'
} as const;

export type GuessResult = typeof GuessResult[keyof typeof GuessResult];