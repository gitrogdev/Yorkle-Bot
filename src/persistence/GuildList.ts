import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import Guild from '../game/entities/Guild.js';

export default class GuildList {
	private static guilds: {
		[id: string]: Guild
	};
	private static readonly GUILDS_PATH: string = '../../data/guilds/';

	/**
	 * Loads all guilds from the /data/guilds directory as Guild objects.
	 */
	public static loadGuilds() {
		if (GuildList.guilds) throw new Error(
			'GuildList already loaded!'
		);
		GuildList.guilds = {};

		const guildsPath = path.join(
			path.dirname(fileURLToPath(import.meta.url)),
			GuildList.GUILDS_PATH
		);
		const guildFiles = fs.readdirSync(guildsPath).filter(
			(file) => file.endsWith('.json')
		);
		let loaded = 0;
		for (const file of guildFiles) {
			const contents = fs.readFileSync(
				path.join(guildsPath, file), 'utf8'
			);
			const id = path.parse(file).name.replace(/^guild-/, '')
			const json = JSON.parse(contents);
			GuildList.guilds[id] = Guild.fromJson(id, json);
			loaded++;
		}
		console.log(
			`Successfully loaded ${loaded} guild${loaded === 1 ? '' : 's'} `
			+ 'from local files.'
		);
	}

	/**
	 * Save a guild's data to file
	 *
	 * @param {string} id the ID of the guild to save
	 */
	public static saveGuild(id: string) {
		if (!(id in GuildList.guilds)) throw new Error(
			`No guild found in GuildList with ID ${id}!`
		);

		fs.writeFileSync(
			path.join(
				path.join(
					path.dirname(fileURLToPath(import.meta.url)),
					GuildList.GUILDS_PATH
				), `guild-${id}.json`
			), JSON.stringify(GuildList.guilds[id].toJson())
		);
		console.log(`Successfully saved guild with ID ${id} to file.`);
	}

	/**
	 * Save all guilds' data to file.
	 */
	public static saveGuilds() {
		for (const id of Object.keys(GuildList.guilds)) GuildList.saveGuild(id);
	}

	/**
	 * Adds a new guild to the GuildList.
	 *
	 * @param {Guild} guild the guild to add to the GuildList
	 */
	public static add(guild: Guild) {
		if (guild.id in GuildList.guilds) throw new Error(
			`Guild with ID ${guild.id} already exists in the GuildList!`
		);
		GuildList.guilds[guild.id] = guild;
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
	public static get(id: string): Guild {
		if (!(id in GuildList.guilds)) throw new Error(
			`No guild found in GuildList with ID ${id}!`
		);

		return GuildList.guilds[id];
	}
}