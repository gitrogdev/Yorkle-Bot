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
import type GameFactory from './GameFactory.js';
import type GameDataStore from '../../persistence/datastores/GameDataStore.js';
import pluralize from '../../util/pluralize.js';
import type GameResults from '../../persistence/dto/GameResults.js';

export default class SongQueue {
	/** The unplayed songs currently in the queue. */
	private queue: Song[] = [];

	/** The songs that have already been played. */
	private played: Song[] = [];

	/** The incremental value representing the current iteration of the game. */
	private day!: number;

	/** The index in the saved queue array of the current song. */
	private index!: number;

	/** The date the queue was last advanced at, in YYYY-MM-DD format. */
	private lastPlayed!: string;

	/** The game associated with the current song in the queue. */
	private game!: Game;

	/** Promise that resolves when object initilization completes. */
	public readonly ready: Promise<void>;

	/** Debounce promise that resolves when queue advancement completes. */
	private advanceDebounce: Promise<void> | null = null;

	/**
	 * Creates a new song queue using the data from a provided data store.
	 *
	 * @author gitrog
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
		private gameFactory: GameFactory,
		private broadcastResults: (results: GameResults) => Promise<void>,
		private openPostgameThreads: () => Promise<void>
	) {
		this.ready = this.init();
	}

	/**
	 * Initialize the song queue asynchronously.
	 *
	 * @author gitrog
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
			await this.save();
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
	 * @author gitrog
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
	 * @author gitrog
	 *
	 * @returns {Promise<void>} a Promise that resolves when the advance has
	 * finished to prevent simultaneous calls
	 */
	private async advance(): Promise<void> {
		await this.ready;
		if (this.advanceDebounce) return this.advanceDebounce;

		this.advanceDebounce = (async () => {
			const today = getDate();
			if (today === this.lastPlayed) return;

			let startup = true;
			if (this.game) {
				this.broadcastResults(this.game.getResults());
				this.game.sentResults = true;
				await this.gameStore.save(this.game);
				startup = false;
			}

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
			await this.gameStore.save(this.game);

			if (startup && this.game.day > 1) {
				console.log('Sending startup message...');
				const yesterday = this.gameFactory.fromJson(
					this.gameStore.load(this.game.day - 1)
				);
				if (!yesterday.sentResults) {
					this.broadcastResults(yesterday.getResults());
					yesterday.sentResults = true;
					await this.gameStore.save(yesterday);
				}
			}

			console.log('Successfully advanced the queue.');
			await this.save();
			this.openPostgameThreads();
		})().finally(() => this.advanceDebounce = null);

		return this.advanceDebounce;
	}

	/**
	 * Packages the queue data and saves it to file.
	 *
	 * @author gitrog
	 */
	private async save() {
		const hexifiedQueue: string[] = [];

		function hexifyQueue(queue: Song[]) {
			queue.forEach(song => hexifiedQueue.push(hexify(song.filename)));
		}

		hexifyQueue(this.played);
		hexifyQueue(this.queue);

		return await this.queueStore.save({
			index: this.index,
			day: this.day,
			lastPlayed: this.lastPlayed,
			queue: hexifiedQueue
		});
	}

	/**
	 * Gets today's iteration of the Yorkle puzzle.
	 *
	 * @author gitrog
	 *
	 * @returns {Promise<Game>} a Promise of today's game
	 */
	public async getGame(): Promise<Game> {
		await this.ready;
		await this.advance();
		return this.game;
	}
}