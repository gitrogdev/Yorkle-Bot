import type DailyResults from '../model/DailyResults.js';

/**
 * Port interface for broadcasting from the game to the presentation layer.
 *
 * Presentation layer should implement the interface and its methods, and game
 * layer will broadcast to the attached interface.
 *
 * @author gitrog
 */
export default interface BroadcastPort {
	/**
	 * Sends the daily results from the game to the configured destination.
	 *
	 * @author gitrog
	 *
	 * @param {DailyResults} results a recap of the results for a single day's
	 * iteration of the puzzle
	 */
	sendDailyResults(results: DailyResults): Promise<void>;
}