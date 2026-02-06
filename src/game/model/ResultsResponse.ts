/**
 * Contains information about the results for an iteration of the puzzle for an
 * individual user.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	day: 3,
 * 	sequence: 'XX-O'
 * }
 */
export default interface ResultsResponse {
	/**
	 * The incremental value representing the iteration of the game being
	 * played.
	 */
	day: number,

	/**
	 * A sequence of characters representing the user's guesses, if the user has
	 * completed the game.
	 */
	sequence?: string
}