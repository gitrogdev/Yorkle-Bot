import GuildDataStore from '../persistence/datastores/GuildDataStore.js';
import SongQueueStore from '../persistence/datastores/SongQueueStore.js';
import GuildList from './services/GuildList.js';
import SongQueue from './services/SongQueue.js';

export default class Yorkle {
	private readonly guilds: GuildList = new GuildList(new GuildDataStore());
	private readonly queue: SongQueue = new SongQueue(new SongQueueStore());
}