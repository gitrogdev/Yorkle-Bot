import { Client, GatewayIntentBits } from 'discord.js';
import Bot from '../presentation/discord/Bot.js';

export default class DiscordClient {
	/** The client for connecting to the Discord API. */
	private client: Client;

	/**
	 * Builds a new client for the Discord bot.
	 *
	 * @author gitrog
	 *
	 * @param {string} version the version number for the application
	 */
	constructor(private version: string) {
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds]
		});
	}

	/**
	 * Starts the bot client.
	 *
	 * @author gitrog
	 *
	 * @param {string} token the Discord bot's secret token
	 */
	async start(token: string, appId: string): Promise<void> {
		if (!token?.trim()) throw new Error(
			'DISCORD_TOKEN is missing or empty.'
		);

		await this.client.login(token);
		await new Bot(this.version, this.client, token, appId).register();
	}
}