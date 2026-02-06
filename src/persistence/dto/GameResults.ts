/**
 * Contains the results for each player for a single iteration of the game.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	'1234567890': {
 * 		sequence: 'X-O'
 * 	}
 * }
 */
export default interface GameResults {
	/** An associative array of user IDs to individual results. */
	[
		/** A unique identifier for a player. */
		id: string
	]: {
		/** A sequence of characters representing the player's guesses. */
		sequence: string
	}
}