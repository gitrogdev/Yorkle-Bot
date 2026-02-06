import { type Client } from 'discord.js';

import CommandRegistrar from './services/CommandRegistrar.js';
import CommandRouter from './services/CommandRouter.js';
import InteractionCreateEvent from './events/InteractionCreateEvent.js';
import ClientReadyEvent from './events/ClientReadyEvent.js';
import StatusCycler from './presence/StatusCycler.js';

import statuses from '../../config/statuses.json' with { type: 'json' };
import Yorkle from '../../game/Yorkle.js';
import GameInteractionHandler from './services/GameInteractionHandler.js';
import Messenger from './services/Messenger.js';
import DiscordBroadcaster from './services/DiscordBroadcaster.js';

export default class Bot {
	private game!: Yorkle;
	private registrar: CommandRegistrar;
	private messenger: Messenger;

	/**
	 * Builds a new representation of the Discord bot.
	 *
	 * @author gitrog
	 *
	 * @param {string} version the version number for the application
	 * @param {Client} client the client to bind the bot to
	 * @param {string} token the Discord bot's secret token
	 * @param {string} appId the application ID of the Discord application
	 */
	constructor(
		public readonly version: string,
		private client: Client,
		token: string,
		appId: string
	) {
		this.registrar = new CommandRegistrar(token, appId);
		this.messenger = new Messenger(this.client);
	}

	/**
	 * Binds events and builds all commands for the bot.
	 *
	 * @author gitrog
	 */
	public async register() {
		this.game = new Yorkle(new DiscordBroadcaster(
			this.client,
			this.messenger
		));

		await this.game.ready;

		const commandRouter = new CommandRouter(
			this.registrar.register(new GameInteractionHandler(
				this.version,
				this.game,
				this.messenger
			))
		);
		const statusCycler = new StatusCycler(statuses, 300_000);

		new InteractionCreateEvent(commandRouter).register(this.client);
		new ClientReadyEvent(statusCycler).register(this.client);
	}
}