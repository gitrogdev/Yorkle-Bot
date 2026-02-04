import fs from 'node:fs';

import type QueueData from '../dto/QueueData.js';
import { QUEUE_PATH } from '../../config/paths.js';

export default class SongQueueStore {
	/**
	 * Loads data for the song queue from file.
	 *
	 * @returns {QueueData | null} a JSON object containing the queue data
	 * stored to file, or null if not found
	 */
	public load(): QueueData | null {
		if (!fs.existsSync(QUEUE_PATH)) return null;

		return JSON.parse(
			fs.readFileSync(QUEUE_PATH, 'utf-8')
		);
	}

	/**
	 * Writes formatted queue data to file.
	 *
	 * @param {QueueData} data the queue data to write to the queue file
	 */
	public async save(data: QueueData) {
		await fs.promises.writeFile(QUEUE_PATH, JSON.stringify(data)).then((
			() => console.log('Successfully saved song queue to file.')
		));
	}
}