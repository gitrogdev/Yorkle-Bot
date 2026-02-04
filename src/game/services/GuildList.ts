import type GuildDataStore from
	'../../persistence/datastores/GuildDataStore.js';
import pluralize from '../../util/pluralize.js';
import Guild from '../entities/Guild.js';

export default class GuildList {
	private guilds: Record<string, Guild> = {};

	/**
	 * Creates a new guild list using the data from a provided data store.
	 *
	 * @param {GuildDataStore} store the data store to load the guild data from
	 */
	constructor(private store: GuildDataStore) {
		const guilds = this.store.load();

		let loaded = 0;
		for (const guildInfo of guilds) {
			this.guilds[guildInfo.id] = Guild.fromJson(guildInfo);
			loaded++;
		}

		console.log(
			`Successfully loaded ${pluralize('guild', loaded)} from local `
			+ 'files.'
		);
	}

	/**
	 * Adds a new guild to the GuildList.
	 *
	 * @param {Guild} guild the guild to add to the GuildList
	 */
	public add(guild: Guild) {
		if (guild.id in this.guilds) throw new Error(
			`Guild with ID ${guild.id} already exists in the GuildList!`
		);
		this.guilds[guild.id] = guild;
		console.log(
			`Successfully added guild with ID ${guild.id} to GuildList.`
		);
	}

	/**
	 * Gets a Guild from the GuildList by ID.
	 *
	 * @param {string} id the Discord Guild ID of the guild
	 *
	 * @returns {Guild} the Guild Object represented by the provided ID
	 */
	public get(id: string): Guild {
		if (!(id in this.guilds)) throw new Error(
			`No guild found in GuildList with ID ${id}!`
		);

		return this.guilds[id];
	}

	/**
	 * Gets an array of all loaded guilds.
	 *
	 * @returns {string[]} an array of all loaded guilds.
	 */
	public getGuilds(): Guild[] {
		return Object.values(this.guilds);
	}

	/**
	 * Adds a user to a guild, and creates the guild if it does not exist.
	 *
	 * @param {string} id the ID of the guild to add the user to
	 * @param {string} user the ID of the user to add to the guild
	 */
	public async joinGuild(id: string, user: string) {
		if (!(id in this.guilds)) this.guilds[id] = new Guild(id);
		this.guilds[id].members.add(user);
		return await this.saveGuild(id);
	}

	/**
	 * Save a guild's data to file.
	 *
	 * @param {string} id the ID of the guild to save
	 */
	public async saveGuild(id: string) {
		if (!(id in this.guilds)) throw new Error(
			`No guild found in GuildList with ID ${id}!`
		);

		return await this.store.save(this.guilds[id]);
	}

	/**
	 * Save all guilds' data to file.
	 */
	public async saveGuilds() {
		for (const id of Object.keys(this.guilds)) await this.saveGuild(id);
	}
}