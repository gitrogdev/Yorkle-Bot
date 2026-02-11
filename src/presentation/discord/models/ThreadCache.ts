/**
 * A cache of the post-game discussion threads stored for the Discord client.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	1: {
 * 		'123456790': '0987654321'
 * 	}
 * }
 */
export default interface ThreadCache {
	[
		/**
		 * The number of the day of the game's iteration, as an integer string.
		 */
		day: string
	] : {
		/** The ID of the thread for the post-game discussion. */
		[
			/** The ID of the guild containing the thread. */
			id: string
		]: string
	}
}