/**
 * JSON-serializable representation of an individual guild for the game to run
 * in.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	streak: 5,
 * 	members: ['1234567890', '9876543210'],
 * 	channel: '1234567890'
 * }
 */
export default interface GuildJson {
	/**
	 * The number of consecutive days the puzzle has been completed by at least
	 * one member of the guild.
	 */
	streak: number,

	/** An array containing a unique identifier for each member of the guild. */
	members: string[],

	/**
	 * The ID of the channel configured to receive announcements from the bot.
	 */
	channel: string | null
};