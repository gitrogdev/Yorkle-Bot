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
import { LyricOption } from './model/LyricOption.js';
import type PostgameDiscussionPort from './ports/PostgameDiscussionPort.js';
import type UserIdentity from './model/UserIdentity.js';
import type Session from './entities/Session.js';
import type OpenSessionResponse from './model/OpenSessionResponse.js';
import type Game from './entities/Game.js';
import Guild from './entities/Guild.js';

export default class Yorkle {
	/** The list of all guilds the game is running in. */
	private readonly guilds: GuildList;

	/** The library of all the songs used by the game. */
	private readonly songs: SongLibrary = new SongLibrary(new SongDataStore());

	/** The registry of all valid aliases for song guesses. */
	private readonly aliases: AliasRegistry = new AliasRegistry(this.songs);

	/** The data store used to save and load game data from file. */
	private readonly gameStore: GameDataStore = new GameDataStore();

	/** The queue containing songs used by the game in shuffled order. */
	private readonly queue: SongQueue;

	/** Manager used to handle game sessions for players. */
	private readonly sessions: SessionManager;

	/** Map of lyric file options to their associated archives. */
	private readonly lyrics: Record<LyricOption, LyricArchive> = {
		[LyricOption.Lyric]: new LyricArchive('lyrics.txt'),
		[LyricOption.Judgement]: new LyricArchive('judgements.txt')
	}

	/** Promise that resolves when object initilization completes. */
	public readonly ready = this.init();

	public getGame: () => Promise<Game>;

	public createGuild: (id: string) => Guild;
	public getGuild: (id: string) => Guild | null;
	public joinGuild: (id: string, user: string) => Promise<void>;
	public saveGuild: (id: string) => Promise<void>;

	public getSession: (user: UserIdentity) => Session | undefined;
	public openSession: (user: UserIdentity) => Promise<OpenSessionResponse>;

	public countSongs = this.songs.getSize.bind(this.songs);

	/**
	 * Creates a new interface to handle all game logic for Yorkle.
	 *
	 * @author gitrog
	 *
	 * @param {BroadcastPort} broadcaster the port to broadcast messages from
	 * the game to
	 * @param {PostgameDiscussionPort} postgameManager the port to use to
	 * manage postgame discussion threads
	 */
	constructor(
		private readonly broadcaster: BroadcastPort,
		private readonly postgameManager: PostgameDiscussionPort
	) {
		this.guilds = new GuildList(
			new GuildDataStore(),
			this.postgameManager
		);

		this.createGuild = this.guilds.createGuild.bind(this.guilds);
		this.getGuild = this.guilds.get.bind(this.guilds);
		this.joinGuild = this.guilds.joinGuild.bind(this.guilds);
		this.saveGuild = this.guilds.saveGuild.bind(this.guilds);

		this.queue = new SongQueue(
			new SongQueueStore(),
			this.gameStore,
			this.songs,
			new ClipGenerator(clipLengths),
			new GameFactory(this.songs, this.aliases, this.gameStore),
			this.broadcastResults.bind(this),
			this.openPostgameThreads.bind(this)
		);
		this.getGame = this.queue.getGame.bind(this.queue);

		this.sessions = new SessionManager(
			clipLengths,
			this.queue,
			this.postgameManager
		);
		this.getSession = this.sessions.getSession.bind(this.sessions);
		this.openSession = this.sessions.open.bind(this.sessions);
	}

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
	 * Opens the post-game discussion threads for today's iteration of the game.
	 *
	 * @author gitrog
	 */
	public async openPostgameThreads() {
		const game = await this.queue.getGame();

		for (
			const guild of this.guilds.getGuilds()
		) await this.postgameManager.openPostgameThread(guild, game);
		return await this.guilds.saveGuilds();
	}

	/**
	 * Returns a random lyric from the provided archive.
	 *
	 * @author gitrog
	 *
	 * @param {LyricOption} archive the archive to get the lyric from
	 *
	 * @returns {Promise<string>} a promise of the random lyric chosen from the
	 * archive
	 */
	public async randomLyric(archive: LyricOption): Promise<string> {
		return await this.lyrics[archive].randomLyric();
	}
}