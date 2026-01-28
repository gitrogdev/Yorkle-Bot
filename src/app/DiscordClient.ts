import { Client, GatewayIntentBits } from 'discord.js';
import Bot from '../presentation/discord/Bot.js';

export default class DiscordClient {
	private client: Client;

	/**
	 * Builds a new client for the Discord bot.
	 */
	constructor() {
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds]
		});
	}

	/**
	 * Starts the bot client
	 *
	 * @param {string} token the Discord bot's secret token
	 */
	async start(token: string): Promise<void> {
		if (!token?.trim()) throw new Error(
			'DISCORD_TOKEN is missing or empty.'
		);

		await this.client.login(token);
		new Bot(this.client).register();
	}
}