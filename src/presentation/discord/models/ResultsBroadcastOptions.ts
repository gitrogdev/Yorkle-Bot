/**
 * Options to be used to send a message broadcasting a daily recap of an
 * iteration of the game in a guild.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	channel: '1234567890',
 * 	locale: 'en-US',
 * 	i18nParams: {
 * 		streak: 32,
 * 		streakEmojis: '🔥🔥',
 * 		results: 'X/6: <@1234567890>',
 * 		avg: '7.00',
 * 		loss: 7
 * 	}
 * }
 */
export default interface ResultsBroadcastOptions {
	/** The ID of the Discord channel to send the recap message to. */
	channel: string,

	/** The preferred locale of the guild to send the recap message to. */
	locale: string,

	/** Parameters to be replaced with variables in the localized message. */
	i18nParams: {
		/**
		 * The number of consecutive days the puzzle has been completed by at
		 * least one member of the guild.
		 */
		streak: number,

		/** A sequence of emojis representing the duration of the streak. */
		streakEmojis: string,

		/** The formatted results showing players divided by score. */
		results: string,

		/** The average of all the players' scores, to two decimal places. */
		avg: string,

		/** The number of guesses losses are scored as for averaging. */
		loss: number
	}
}