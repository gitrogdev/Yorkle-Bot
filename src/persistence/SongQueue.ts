import fs from 'node:fs';
import path from 'node:path';

import type Song from '../game/entities/Song.js';
import type QueueData from './dto/QueueData.js';
import SongLibrary from './SongLibrary.js';
import { dehexify } from '../util/hex-string.js';
import { fileURLToPath } from 'node:url';

export default class SongQueue {
	private static readonly QUEUE_PATH = path.join(
		path.dirname(fileURLToPath(import.meta.url)),
		'../../data/game-queue.json'
	);

	private static queue: Song[];
	private static played: Song[];

	public static loadQueue() {
		if (SongQueue.queue !== null) throw new Error(
			'SongQueue already loaded!'
		);
		SongQueue.queue = [];
		SongQueue.played = [];

		let queueData: QueueData;
		if (fs.existsSync(SongQueue.QUEUE_PATH)) queueData = JSON.parse(
			fs.readFileSync(SongQueue.QUEUE_PATH, 'utf-8')
		); else queueData = {
			index: -1,
			day: 0,
			lastPlayed: new Date(
				new Date().setDate(new Date().getDate() - 1)
			).toISOString().split('T')[0],
			queue: []
		};

		if (queueData.queue.length > 0) for (
			let i = 0; i < queueData.queue.length; i++
		) (i < queueData.index ? SongQueue.played : SongQueue.queue).push(
			SongLibrary.getSong(dehexify(queueData.queue[i]))
		); else SongQueue.queue = SongLibrary.shuffle();

		const inQueue = SongQueue.queue.length;
		console.log(
			`Successfully loaded ${inQueue} song${inQueue === 1 ? '' : 's'} `
			+ `into the queue (${SongQueue.played.length} already played)`
		)
	}
}