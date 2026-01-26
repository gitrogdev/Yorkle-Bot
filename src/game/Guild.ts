export default class Guild {
	public id: string;
	public streak: number;
	public members: Set<string>;
	public channelId: string | null;

	/**
	 * Creates a representation of a new Discord guild.
	 * 
	 * @param {string} id the Discord guild ID of the guild to represent
	 */
	constructor(id: string);

	/**
	 * Creates a representation of a Discord guild within the bot.
	 * 
	 * @param {string} id the Discord guild ID of the guild to represent
	 * @param {number} streak the number of days in a row users in this guild
	 * have played the game
	 * @param {string[]} members an array of Discord user IDs who have played
	 * the game and are members of this guild
	 * @param {string | null} channelId the channel ID in the guild for the bot
	 * to send recap messages to
	 */
	constructor (
		id: string,
		streak: number = 0,
		members: string[] = [],
		channelId: string | null = null
	) {
		this.id = id;
		this.streak = streak;
		this.members = new Set(members);
		this.channelId = channelId;
	}
}