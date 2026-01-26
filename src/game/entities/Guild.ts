import path from 'node:path';

import type GuildJson from '../../persistence/dto/GuildJson.js';

export default class Guild {
	public readonly id: string;
	public streak: number;
	public members: Set<string>;
	public channelId: string | null;

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
	constructor(
		id: string,
		streak?: number,
		members?: string[],
		channelId?: string | null
	);
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
	 * @param {string} filename the filename of the JSON file
	 * @param {GuildJson} json the JSON data to create the guild from
	 *
	 * @returns {Guild} the representation of the guild's data created
	 */
	public static fromJson(filename: string, json: GuildJson): Guild {
		return new Guild(
			path.parse(filename).name.replace(/^guild-/, ''),
			json.streak, json.members, json.channel
		);
	}

	/**
	 * Returns a JSON representation of the guild's data.
	 *
	 * @returns {GuildJson} the JSON representation of the guild's data.
	 */
	toJSON(): GuildJson {
		return {
			streak: this.streak,
			members: [...this.members],
			channel: this.channelId
		};
	}
}