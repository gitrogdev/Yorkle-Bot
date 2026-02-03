import fs from 'node:fs';

import type GameJson from '../dto/GameJson.js';
import path from 'node:path';
import { DAYS_PATH } from '../../config/paths.js';
import padDay from '../../util/pad-day.js';
import type Game from '../../game/entities/Game.js';
import { hexify } from '../../util/hex-string.js';

export default class GameDataStore {
	/**
	 * Loads the game data for a given day from the file.
	 *
	 * @param {number} day the day to load the game data from
	 *
	 * @returns {GameJson} the loaded game data
	 */
	public load(day: number): GameJson {
		const data = JSON.parse(fs.readFileSync(
			path.join(DAYS_PATH, `yorkle-day${padDay(day)}.json`), 'utf-8'
		));

		return {
			day: ('title' in data) ? hexify(data.song) : data.day,
			song: data.song,
			players: data.players
		}
	}

	/**
	 * Save a daily iteration of the game's data to file.
	 *
	 * @param {Game} game the game to save to file
	 */
	public save(game: Game) {
		const data = game.toJson();
		fs.promises.writeFile(
			path.join(DAYS_PATH, `yorkle-day${padDay(data.day)}.json`),
			JSON.stringify(data),
			'utf-8'
		).then(() => console.log(
			`Successfully saved data for game Yorkle #${data.day} to file.`
		));
	}
}