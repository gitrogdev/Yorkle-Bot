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

export default class Yorkle {
	private readonly guilds: GuildList = new GuildList(new GuildDataStore());
	private readonly songs: SongLibrary = new SongLibrary(new SongDataStore());
	private readonly aliases: AliasRegistry = new AliasRegistry(this.songs);
	private readonly gameStore: GameDataStore = new GameDataStore();
	private readonly queue: SongQueue = new SongQueue(
		new SongQueueStore(),
		this.gameStore,
		this.songs,
		new ClipGenerator(clipLengths),
		new GameFactory(this.songs, this.aliases, this.gameStore)
	);
	public readonly sessions = new SessionManager(clipLengths, this.queue);

	public readonly ready = this.init();

	private async init() {
		await this.songs.ready;
		await this.queue.ready;
		await this.aliases.ready;
	}
}