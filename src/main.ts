import DiscordClient from './presentation/discord/DiscordClient.js';
import pkg from '../package.json' with { type: 'json' };
import { env } from './config/env.js';

new DiscordClient(pkg.version).start(env.DISCORD_TOKEN, env.APPLICATION_ID);