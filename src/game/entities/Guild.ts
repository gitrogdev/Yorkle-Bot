import type GuildInfo from '../../persistence/dto/GuildInfo.js';
import type GuildJson from '../../persistence/dto/GuildJson.js';

export default class Guild {
	/** The unique identifier for the guild. */
	public readonly id: string;

	/**
	 * The number of consecutive days the puzzle has been completed by at least
	 * one member of the guild.
	 */
	public streak: number;

	/** A set containing the unique identifiers of the members of the guild. */
	public members: Set<string>;

	/**
	 * The ID of the channel configured to receive announcements from the bot.
	 */
	public channelId: string | null;

	/**
	 * Creates a representation of a Discord guild within the bot.
	 *
	 * @author gitrog
	 *
	 * @param {string} id the unique identifier for the guild
	 * @param {number} streak the number of consecutive days the puzzle has been
	 * completed by at least one member of the guild
	 * @param {string[]} members an array of Discord user IDs who have played
	 * the game and are members of this guild
	 * @param {string | null} channelId the channel ID in the guild for the bot
	 * to send recap messages to
	 */
	constructor(
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

	/**
	 * Factory method which builds a new representation of a guild's data from
	 * a stored JSON object.
	 *
	 * @author gitrog
	 *
	 * @param {GuildInfo} info the stored information for the guild
	 *
	 * @returns {Guild} the representation of the guild's data created
	 */
	public static fromJson(info: GuildInfo): Guild {
		return new Guild(
			info.id,
			info.data.streak,
			info.data.members,
			info.data.channel
		);
	}

	/**
	 * Returns a JSON representation of the guild's data.
	 *
	 * @author gitrog
	 *
	 * @returns {GuildJson} the JSON representation of the guild's data.
	 */
	public toJson(): GuildJson {
		return {
			streak: this.streak,
			members: [...this.members],
			channel: this.channelId
		};
	}
}