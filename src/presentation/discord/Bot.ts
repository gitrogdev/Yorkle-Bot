import { Events, type Client } from 'discord.js';
import CommandRegistrar from './commands/CommandRegistrar.js';
import CommandRouter from './commands/CommandRouter.js';

export default class Bot {
	/**
	 * Builds a new representation of the Discord bot.
	 *
	 * @param {Client} client the client to bind the bot to
	 */
	constructor(
		private client: Client
	) {}

	/**
	 * Binds events and builds all commands for the bot.
	 */
	public register(): void {
		const commandRegistrar = new CommandRegistrar();
		const commandRouter = new CommandRouter(commandRegistrar.register());

		this.client.on(Events.InteractionCreate, (i) => commandRouter.route(i));
	}
}