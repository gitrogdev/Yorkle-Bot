import Bot from './app/Bot.js';
import SongLibrary from './persistence/SongLibrary.js';

const bot = new Bot();

await bot.start(process.env.DISCORD_TOKEN!);

SongLibrary.loadSongs();