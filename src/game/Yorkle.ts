import SongQueueStore from '../persistence/datastores/SongQueueStore.js';
import SongQueue from './services/SongQueue.js';

export default class Yorkle {
	private readonly queue: SongQueue;

	/**
	 * Creates a new instance to handle the Yorkle game.
	 */
	constructor() {
		this.queue = new SongQueue(new SongQueueStore());
	}
}