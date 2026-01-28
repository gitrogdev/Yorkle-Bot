import DiscordClient from './app/DiscordClient.js';
import AliasRegistry from './persistence/AliasRegistry.js';
import GuildList from './persistence/GuildList.js';
import SongLibrary from './persistence/SongLibrary.js';

(async () => {
	await SongLibrary.loadSongs();

	GuildList.loadGuilds();
	AliasRegistry.loadAliases();

	await new DiscordClient().start(process.env.DISCORD_TOKEN!);
})();