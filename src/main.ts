import Bot from './app/Bot.js';
import AliasRegistry from './persistence/AliasRegistry.js';
import GuildList from './persistence/GuildList.js';
import SongLibrary from './persistence/SongLibrary.js';

const bot = new Bot();

await bot.start(process.env.DISCORD_TOKEN!);

(async () => {
	await SongLibrary.loadSongs();
	await GuildList.loadGuilds();

	AliasRegistry.loadAliases();
})();