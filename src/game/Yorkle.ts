import clipLengths from '../config/guesslengths.json' with { type: 'json' };
import GameDataStore from '../persistence/datastores/GameDataStore.js';
import GuildDataStore from '../persistence/datastores/GuildDataStore.js';
import SongDataStore from '../persistence/datastores/SongDataStore.js';
import SongQueueStore from '../persistence/datastores/SongQueueStore.js';
import GameFactory from './services/GameFactory.js';
import AliasRegistry from './services/AliasRegistry.js';
import ClipGenerator from './services/ClipGenerator.js';
import GuildList from './services/GuildList.js';
import SongLibrary from './services/SongLibrary.js';
import SongQueue from './services/SongQueue.js';
import SessionManager from './services/SessionManager.js';
import type BroadcastPort from './ports/BroadcastPort.js';
import type GameResults from '../persistence/dto/GameResults.js';
import LyricArchive from './services/LyricArchive.js';
import type { LyricOption } from './model/LyricOption.js';

export default class Yorkle {
	/** The list of all guilds the game is running in. */
	private readonly guilds: GuildList = new GuildList(new GuildDataStore());

	/** The library of all the songs used by the game. */
	private readonly songs: SongLibrary = new SongLibrary(new SongDataStore());

	/** The registry of all valid aliases for song guesses. */
	private readonly aliases: AliasRegistry = new AliasRegistry(this.songs);

	/** The data store used to save and load game data from file. */
	private readonly gameStore: GameDataStore = new GameDataStore();

	/** The queue containing songs used by the game in shuffled order. */
	private readonly queue: SongQueue = new SongQueue(
		new SongQueueStore(),
		this.gameStore,
		this.songs,
		new ClipGenerator(clipLengths),
		new GameFactory(this.songs, this.aliases, this.gameStore),
		this.broadcastResults.bind(this)
	);

	/** Manager used to handle game sessions for players. */
	private readonly sessions: SessionManager = new SessionManager(
		clipLengths,
		this.queue
	);

	/** Map of lyric file options to their associated archives. */
	private readonly lyrics: Record<LyricOption, LyricArchive> = {
		LYRIC: new LyricArchive('lyrics.txt'),
		JUDGEMENT: new LyricArchive('judgements.txt')
	}

	/** Promise that resolves when object initilization completes. */
	public readonly ready = this.init();

	public getGame = this.queue.getGame.bind(this.queue);

	public createGuild = this.guilds.createGuild.bind(this.guilds);
	public getGuild = this.guilds.get.bind(this.guilds);
	public joinGuild = this.guilds.joinGuild.bind(this.guilds);
	public saveGuild = this.guilds.saveGuild.bind(this.guilds);

	public getSession = this.sessions.getSession.bind(this.sessions);
	public openSession = this.sessions.open.bind(this.sessions);

	public countSongs = this.songs.getSize.bind(this.songs);

	/**
	 * Creates a new interface to handle all game logic for Yorkle.
	 *
	 * @author gitrog
	 *
	 * @param {BroadcastPort} broadcaster the port to broadcast messages from
	 * the game to
	 */
	constructor(private readonly broadcaster: BroadcastPort) {}

	private async init() {
		await this.songs.ready;
		await this.queue.ready;
		await this.aliases.ready;
	}

	/**
	 * Broadcasts the provided game results to the connected broadcaster.
	 *
	 * @author gitrog
	 *
	 * @param {GameResults} results the results from the previous day's puzzle
	 */
	private async broadcastResults(results: GameResults) {
		await this.broadcaster.sendDailyResults({
			results: results,
			max: clipLengths.length,
			guilds: this.guilds.getGuilds()
		});
		console.log('Successfully broadcast daily results to Discord.');
		await this.guilds.saveGuilds();
	}

	/**
	 * Returns a random lyric from the provided archive.
	 *
	 * @author gitrog
	 *
	 * @param {LyricOption} archive the archive to get the lyric from
	 *
	 * @returns {Promise<string>}
	 */
	public async randomLyric(archive: LyricOption): Promise<string> {
		return await this.lyrics[archive].randomLyric();
	}
}