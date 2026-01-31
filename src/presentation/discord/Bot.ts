import { type Client } from 'discord.js';

import CommandRegistrar from './services/CommandRegistrar.js';
import CommandRouter from './services/CommandRouter.js';
import InteractionCreateEvent from './events/InteractionCreateEvent.js';
import ClientReadyEvent from './events/ClientReadyEvent.js';
import StatusCycler from './presence/StatusCycler.js';

import statuses from '../../config/statuses.json' with { type: 'json' };
import Yorkle from '../../game/Yorkle.js';
import GameInteractionHandler from './services/GameInteractionHandler.js';

export default class Bot {
	private game!: Yorkle;
	private registrar: CommandRegistrar;

	/**
	 * Builds a new representation of the Discord bot.
	 *
	 * @param {Client} client the client to bind the bot to
	 * @param {string} token the Discord bot's secret token
	 * @param {string} appId the application ID of the Discord application
	 */
	constructor(
		private client: Client,
		token: string,
		appId: string
	) {
		this.registrar = new CommandRegistrar(token, appId);
	}

	/**
	 * Binds events and builds all commands for the bot.
	 */
	public async register() {
		this.game = new Yorkle();
		await this.game.ready;

		const commandRouter = new CommandRouter(
			this.registrar.register(new GameInteractionHandler(this.game))
		);
		const statusCycler = new StatusCycler(statuses, 300_000);

		new InteractionCreateEvent(commandRouter).register(this.client);
		new ClientReadyEvent(statusCycler).register(this.client);
	}
}