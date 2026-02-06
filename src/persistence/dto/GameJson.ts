import type GameResults from './GameResults.js';

/**
 * JSON-serializable representation of a single iteration of the game's state.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	day: 1,
 * 	song: '006800610069007200640072007900650072002e006d00700033',
 * 	players: GameResults,
 * 	sentResults: false
 * }
 */
export default interface GameJson {
	/** The incremental value representing the iteration of the game. */
	day: number,

	/**
	 * A UTF-16 hexadecimal representation of the song's file name,
	 * including the .mp3 extension.
	 */
	song: string,

	/**
	 * The results for each player who completed this iteration of the game.
	 *
	 * @see {@link GameResults}
	 */
	players: GameResults,

	/**
	 * Whether a recap of the game's results have already been broadcast to
	 * the presentation layer.
	 */
	sentResults?: boolean
}