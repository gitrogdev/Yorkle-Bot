import type Song from '../entities/Song.js';
import SongLibrary from './SongLibrary.js';
import { dehexify, hexify } from '../../util/hex-string.js';
import type SongQueueStore from
	'../../persistence/datastores/SongQueueStore.js';
import type QueueData from '../../persistence/dto/QueueData.js';
import getDate from '../../util/get-date.js';
import shuffleArray from '../../util/shuffle-array.js';
import type ClipGenerator from './ClipGenerator.js';
import type Game from '../entities/Game.js';
import type GameFactory from '../entities/GameFactory.js';
import type GameDataStore from '../../persistence/datastores/GameDataStore.js';
import pluralize from '../../util/pluralize.js';

export default class SongQueue {
	private queue: Song[] = [];
	private played: Song[] = [];

	private day!: number;
	private index!: number;
	private lastPlayed!: string;
	private game!: Game;

	public readonly ready: Promise<void>;
	private advanceDebounce: Promise<void> | null = null;

	/**
	 * Creates a new song queue using the data from a provided data store.
	 *
	 * @param {SongQueueStore} queueStore the data store to load the queue data
	 * from
	 * @param {GameDataStore} gameStore the data store to load the game data
	 * from
	 * @param {SongLibrary} lib the song library to load the songs from
	 * @param {ClipGenerator} generator the clip generator to generate the clips
	 * with
	 */
	constructor(
		private queueStore: SongQueueStore,
		private gameStore: GameDataStore,
		private lib: SongLibrary,
		private generator: ClipGenerator,
		private gameFactory: GameFactory
	) {
		this.ready = this.init();
	}

	/**
	 * Initialize the song queue asynchronously.
	 */
	private async init() {
		await this.lib.ready;
		const data = this.queueStore.load() || SongQueue.defaultData();

		if (data.queue.length > 0) for (
			let i = 0; i < data.queue.length; i++
		) (i < data.index ? this.played : this.queue).push(
			this.lib.getSong(dehexify(data.queue[i]))
		); else this.queue = this.lib.shuffle();

		this.day = data.day;
		this.index = data.index;
		this.lastPlayed = data.lastPlayed;

		const inQueue = this.queue.length;
		const played = this.played.length;
		const librarySize = this.lib.getSize();

		if (inQueue + played < librarySize) {
			const newSongs = this.lib.getNewSongs(data.queue.map(
				song => dehexify(song)
			));
			for (const song of newSongs) this.queue.push(song);
			shuffleArray(this.queue);
			console.log(
				`Successfully added ${pluralize('song', newSongs.length)} to `
				+ 'the queue and shuffled all unplayed songs.'
			);
			this.save();
		} else if (inQueue + played > librarySize) {
			const diff = (inQueue + played) - librarySize;
			throw new Error(
				`Failed to load ${pluralize('song', diff)} from song `
				+ `library. (${inQueue + played} in queue, ${librarySize} in `
				+ 'song library.'
			);
		} else console.log(
			`Successfully loaded ${pluralize('song', inQueue)} into the queue `
			+ `(${this.played.length} already played)`
		);

		const today = getDate();
		if (today === this.lastPlayed) this.game = this.gameFactory.fromJson(
			this.gameStore.load(this.day)
		); else this.advance();
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

	/**
	 * Advances the queue, and reshuffles it if the end is reached.
	 *
	 * @returns {Promise<void>} a Promise that resolves when the advance has
	 * finished to prevent simultaneous calls
	 */
	private async advance(): Promise<void> {
		if (this.advanceDebounce) return this.advanceDebounce;

		this.advanceDebounce = (async () => {
			const today = getDate();
			if (today === this.lastPlayed) return;

			if (this.game) this.gameStore.save(this.game);

			this.lastPlayed = today;
			this.day++;

			if (this.queue.length > 0) {
				this.played.push(this.queue.shift()!);
				this.index++;
			} else {
				this.queue.push(...this.played);
				this.played.length = 0;
				shuffleArray(this.queue);
				console.log(
					'Successfully reached end of queue and reshuffled all '
					+ 'songs.'
				);
			}

			this.generator.generate(this.queue[0], this.day);

			this.game = this.gameFactory.createGame(this.day, this.queue[0]);
			this.gameStore.save(this.game);

			console.log('Successfully advanced the queue.');
			this.save();
		})().finally(() => this.advanceDebounce = null);

		return this.advanceDebounce;
	}

	/**
	 * Packages the queue data and saves it to file.
	 */
	private save() {
		const hexifiedQueue: string[] = [];

		function hexifyQueue(queue: Song[]) {
			queue.forEach(song => hexifiedQueue.push(hexify(song.filename)));
		}

		hexifyQueue(this.played);
		hexifyQueue(this.queue);

		this.queueStore.save({
			index: this.index,
			day: this.day,
			lastPlayed: this.lastPlayed,
			queue: hexifiedQueue
		});
	}

	/**
	 * Gets the song at the front of the queue.
	 *
	 * @returns {Promise<Song>} a Promise of the song at the front of the queue
	 * that resolves once queue advancement has completed
	 */
	public async getSong(): Promise<Song> {
		await this.advance();
		return this.queue[0];
	}
}