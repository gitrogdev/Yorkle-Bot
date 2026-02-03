import DiscordClient from './app/DiscordClient.js';

new DiscordClient().start(
	process.env.DISCORD_TOKEN!,
	process.env.APPLICATION_ID!
);