import fs from 'node:fs';

import { STATUSES_PATH } from '../../config/paths.js';

/**
 * Persistence layer object to interact with the statuses.json file, containing
 * Discord presence statuses.
 *
 * @author gitrog
 */
export default class StatusDataStore {
	/**
	 * Loads the Discord presence statuses from the statuses.json file.
	 *
	 * @author gitrog
	 *
	 * @returns an array of strings, each containing a different status
	 */
	public load(): string[] {
		if (!fs.existsSync(STATUSES_PATH)) return [];

		return JSON.parse(
			fs.readFileSync(STATUSES_PATH, 'utf-8')
		);
	}
}