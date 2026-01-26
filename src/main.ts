import Bot from './app/Bot.js';

const bot = new Bot();

await bot.start(process.env.DISCORD_TOKEN!);