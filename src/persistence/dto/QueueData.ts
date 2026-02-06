/**
 * JSON-serializable representation of the game's song queue and associated
 * data.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	index: 6,
 * 	day: 7
 * 	lastPlayed: '2025-02-06',
 * 	queue: [
 * 		'0064006f0077006e006e0065007700750070002e006d00700033',
 * 		'00690071007500690074002e006d00700033'
 * 	]
 * }
 */
export default interface QueueData {
	/** The index in the queue array of the current song. */
	index: number,

	/** The incremental value representing the current iteration of the game. */
	day: number,

	/** The date the queue was last updated at, in YYYY-MM-DD format. */
	lastPlayed: string,

	/**
	 * A shuffled array of UTF-16 hexadecimal representation of the file names
	 * of the songs in the queue, including the .mp3 extensions.
	 */
	queue: string[]
}