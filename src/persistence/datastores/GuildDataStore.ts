import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import type GuildInfo from '../dto/GuildInfo.js';
import type Guild from '../../game/entities/Guild.js';

export default class GuildDataStore {
	private static readonly GUILDS_PATH = path.join(
		path.dirname(fileURLToPath(import.meta.url)),
		'../../data/guilds/'
	);

	/**
	 * Loads data for the guilds from file.
	 *
	 * @returns {GuildInfo[]} an array of guild info, containing the stored data
	 * and the IDs
	 */
	public load(): GuildInfo[] {
		const guilds = [];

		const guildFiles = fs.readdirSync(GuildDataStore.GUILDS_PATH).filter(
			(file) => file.endsWith('.json')
		);

		for (const file of guildFiles) {
			const contents = fs.readFileSync(
				path.join(GuildDataStore.GUILDS_PATH, file), 'utf8'
			);
			guilds.push({
				id: path.parse(file).name.replace(/^guild-/, ''),
				data: JSON.parse(contents)
			});
		}

		return guilds;
	}

	/**
	 * Save an individual guild's data to file.
	 *
	 * @param {Guild} guild the guild to save to file
	 */
	public save(guild: Guild) {
		fs.writeFileSync(
			path.join(
				GuildDataStore.GUILDS_PATH, `guild-${guild.id}.json`
			), JSON.stringify(guild.toJson())
		);
		console.log(`Successfully saved guild with ID ${guild.id} to file.`);
	}
}