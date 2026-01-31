import { type Client } from 'discord.js';

import CommandRegistrar from './commands/CommandRegistrar.js';
import CommandRouter from './commands/CommandRouter.js';
import InteractionCreateEvent from './events/InteractionCreateEvent.js';
import ClientReadyEvent from './events/ClientReadyEvent.js';
import StatusCycler from './presence/StatusCycler.js';

import statuses from '../../config/statuses.json' with { type: 'json' };
import Yorkle from '../../game/Yorkle.js';

export default class Bot {
	private game!: Yorkle;

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
	public async register() {
		this.game = new Yorkle();
		await this.game.ready;

		const commandRegistrar = new CommandRegistrar();
		const commandRouter = new CommandRouter(commandRegistrar.register());
		const statusCycler = new StatusCycler(statuses, 300_000);

		new InteractionCreateEvent(commandRouter).register(this.client);
		new ClientReadyEvent(statusCycler).register(this.client);
	}
}