import DiscordClient from './app/DiscordClient.js';
import AliasRegistry from './persistence/AliasRegistry.js';
import GuildList from './persistence/GuildList.js';
import SongLibrary from './persistence/SongLibrary.js';
import SongQueue from './persistence/SongQueue.js';

(async () => {
	await SongLibrary.loadSongs();

	GuildList.loadGuilds();
	AliasRegistry.loadAliases();
	SongQueue.loadQueue();

	await new DiscordClient().start(process.env.DISCORD_TOKEN!);
})();