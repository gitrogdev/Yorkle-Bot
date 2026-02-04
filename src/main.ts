import DiscordClient from './app/DiscordClient.js';
import pkg from '../package.json' with { type: 'json' };

new DiscordClient(pkg.version).start(
	process.env.DISCORD_TOKEN!,
	process.env.APPLICATION_ID!
);