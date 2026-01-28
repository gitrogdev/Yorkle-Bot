import DiscordClient from './app/DiscordClient.js';
import AliasRegistry from './persistence/AliasRegistry.js';
import GuildList from './persistence/GuildList.js';
import SongLibrary from './persistence/SongLibrary.js';

const client = new DiscordClient();

(async () => {
	await SongLibrary.loadSongs();

	GuildList.loadGuilds();
	AliasRegistry.loadAliases();

	await client.start(process.env.DISCORD_TOKEN!);
})();