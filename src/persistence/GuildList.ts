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
	public static async loadGuilds() {
		if (GuildList.guilds != null) throw new Error(
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
		for (const file of guildFiles) {
			const contents = fs.readFileSync(
				path.join(guildsPath, file), 'utf8'
			);
			const id = path.parse(file).name.replace(/^guild-/, '')
			const json = JSON.parse(contents);
			GuildList.guilds[id] = Guild.fromJson(id, json);
		}
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
			`No guild foun in GuildListd with ID ${id}!`
		);

		return GuildList.guilds[id];
	}
}