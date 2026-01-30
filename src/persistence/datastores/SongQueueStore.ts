import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type QueueData from '../dto/QueueData.js';

export default class SongQueueStore {
	private static readonly QUEUE_PATH = path.join(
		path.dirname(fileURLToPath(import.meta.url)),
		'../../../data/game-queue.json'
	);

	/**
	 * Loads data for the song queue from file.
	 *
	 * @returns {QueueData | null} a JSON object containing the queue data
	 * stored to file, or null if not found
	 */
	public load(): QueueData | null {
		if (!fs.existsSync(SongQueueStore.QUEUE_PATH)) return null;

		return JSON.parse(
			fs.readFileSync(SongQueueStore.QUEUE_PATH, 'utf-8')
		);;
	}
}