import GuildDataStore from '../persistence/datastores/GuildDataStore.js';
import SongDataStore from '../persistence/datastores/SongDataStore.js';
import SongQueueStore from '../persistence/datastores/SongQueueStore.js';
import AliasRegistry from './services/AliasRegistry.js';
import GuildList from './services/GuildList.js';
import SongLibrary from './services/SongLibrary.js';
import SongQueue from './services/SongQueue.js';

export default class Yorkle {
	private readonly guilds: GuildList = new GuildList(new GuildDataStore());
	private readonly songs: SongLibrary = new SongLibrary(new SongDataStore());
	private readonly queue: SongQueue = new SongQueue(
		new SongQueueStore(),
		this.songs
	);
	private readonly aliases: AliasRegistry = new AliasRegistry(this.songs);

	public readonly ready = this.init();

	private async init() {
		await this.songs.ready;
		await this.queue.ready;
		await this.aliases.ready;
	}
}