import { Client, GatewayIntentBits } from 'discord.js';

export default class Bot {
	private client: Client;

	constructor(token: string) {
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds]
		});

		this.client.login(token);
	}
}