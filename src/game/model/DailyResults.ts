import type GameResults from '../../persistence/dto/GameResults.js';
import type Guild from '../entities/Guild.js';

/**
 * Contains information for the recap of the daily results of an individual
 * puzzle.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	results: GameResults,
 * 	max: 6,
 * 	guilds: Guild[]
 * }
 */
export default interface DailyResults {
	/**
	 * The results of an individual puzzle.
	 *
	 * @see {@link GameResults}
	 */
	results: GameResults,

	/** The maximum number of guesses a player is permitted. */
	max: number,

	/**
	 * An array of guilds to broadcast the results to.
	 *
	 * @see {@link Guild}
	 */
	guilds: Guild[]
}