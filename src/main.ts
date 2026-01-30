import DiscordClient from './app/DiscordClient.js';

new DiscordClient().start(process.env.DISCORD_TOKEN!);