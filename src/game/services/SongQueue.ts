import type Song from '../entities/Song.js';
import SongLibrary from '../../persistence/SongLibrary.js';
import { dehexify } from '../../util/hex-string.js';
import type SongQueueStore from
	'../../persistence/datastores/SongQueueStore.js';
import type QueueData from '../../persistence/dto/QueueData.js';
import getDate from '../../util/get-date.js';

export default class SongQueue {
	private queue: Song[];
	private played: Song[];

	private day: number;
	private index: number;
	private lastPlayed: string;

	/**
	 * Creates a new song queue using the data from a provided data store.
	 *
	 * @param {SongQueueStore} store the data store to load the queue data from
	 */
	constructor(store: SongQueueStore) {
		const data = store.load() || SongQueue.defaultData();

		this.queue = [];
		this.played = [];

		if (data.queue.length > 0) for (
			let i = 0; i < data.queue.length; i++
		) (i < data.index ? this.played : this.queue).push(
			SongLibrary.getSong(dehexify(data.queue[i]))
		); else this.queue = SongLibrary.shuffle();

		this.day = data.day;
		this.index = data.index;
		this.lastPlayed = data.lastPlayed;

		const inQueue = this.queue.length;
		console.log(
			`Successfully loaded ${inQueue} song${inQueue === 1 ? '' : 's'} `
			+ `into the queue (${this.played.length} already played)`
		);
	}

	/**
	 * Gets the default data for a new queue.
	 *
	 * @returns {QueueData} default data values for a new queue
	 */
	private static defaultData(): QueueData {
		return {
			index: -1,
			day: 0,
			lastPlayed: getDate(-1),
			queue: []
		};
	}
}