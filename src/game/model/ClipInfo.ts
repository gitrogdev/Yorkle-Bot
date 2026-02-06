/**
 * Contains information for a single audio clip to present to a player.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	path: './data/days/day0001/clip3.mp3',
 * 	clip: 3
 * }
 */
export default interface ClipInfo {
	/** The file path to the clip's audio file. */
	path: string,

	/**
	 * Position of the clip in the playback order of the game session.
	 *
	 * Must be a positive integer.
	 */
	clip: number
}