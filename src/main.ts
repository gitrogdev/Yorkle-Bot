import Bot from './app/Bot.js';

if (process.env.DISCORD_TOKEN == null) throw 'Missing DISCORD_TOKEN from .env';

new Bot(process.env.DISCORD_TOKEN!);