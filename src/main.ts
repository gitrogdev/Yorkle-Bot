import Bot from './app/Bot.js';
import AliasRegistry from './persistence/AliasRegistry.js';
import SongLibrary from './persistence/SongLibrary.js';

const bot = new Bot();

await bot.start(process.env.DISCORD_TOKEN!);

AliasRegistry.loadAliases();
SongLibrary.loadSongs();