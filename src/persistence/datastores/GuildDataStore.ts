import fs from 'node:fs';
import path from 'node:path';

import type GuildInfo from '../dto/GuildInfo.js';
import type Guild from '../../game/entities/Guild.js';
import { GUILDS_PATH } from '../../config/paths.js';

export default class GuildDataStore {
	/**
	 * Loads data for the guilds from file.
	 *
	 * @author gitrog
	 *
	 * @returns {GuildInfo[]} an array of guild info, containing the stored data
	 * and the IDs
	 */
	public load(): GuildInfo[] {
		const guilds = [];

		const guildFiles = fs.readdirSync(GUILDS_PATH).filter(
			(file) => file.endsWith('.json')
		);

		for (const file of guildFiles) {
			const contents = fs.readFileSync(
				path.join(GUILDS_PATH, file), 'utf8'
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
	 * @author gitrog
	 *
	 * @param {Guild} guild the guild to save to file
	 */
	public async save(guild: Guild) {
		return await fs.promises.writeFile(
			path.join(GUILDS_PATH, `guild-${guild.id}.json`),
			JSON.stringify(guild.toJson())
		).then(() => console.log(
			`Successfully saved guild with ID ${guild.id} to file.`
		));
	}
}