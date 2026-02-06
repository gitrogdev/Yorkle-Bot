import type Song from '../entities/Song.js';
import type { GuessResult } from './GuessResult.js';

/**
 * Contains information about the game's response to a player's guess.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	day: 1,
 * 	result: GuessResult,
 * 	guesses: 3,
 * 	song: Song
 * }
 */
export default interface GuessResponse {
	/**
	 * The incremental value representing the iteration of the game being
	 * played.
	 */
	day: number,

	/**
	 * The result of the guess.
	 *
	 * @see {@link GuessResult}
	 */
	result: GuessResult,

	/**
	 * The number of guesses the player has used.
	 */
	guesses: number,

	/**
	 * The song associated with the guess the player made, if any.
	 *
	 * @see {@link Song}
	 */
	song?: Song
}