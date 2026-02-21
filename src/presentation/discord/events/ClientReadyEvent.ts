import { Events, type Client } from 'discord.js';

import DiscordEvent from '../models/DiscordEvent.js';
import StatusCycler from '../presence/StatusCycler.js';
import type AvatarCycler from '../presence/AvatarCycler.js';
import type PresenceCycler from '../models/PresenceCycler.js';

export default class ClientReadyEvent extends DiscordEvent {
	/**
	 * Creates a new ClientReadyEvent.
	 *
	 * @author gitrog
	 *
	 * @param {PresenceCycler[]} cyclers an array of presence cyclers to be
	 * started when the client is ready
	 */
	constructor(
		private cyclers: PresenceCycler[]
	) { super(); };

	/**
	 * Executes the actions to perform once the Discord client is ready.
	 *
	 * @param {Client} readyClient the Discord client that is now ready
	 */
	private onReady(readyClient: Client) {
		if (!readyClient.user) throw new Error(
			'Failed to initialize client: Discord client is ready but user '
			+ 'is null.'
		);

		console.log(
			`Successfully initialized client as @${readyClient.user.tag}.`
		);

		for (const presenceCycler of this.cyclers) presenceCycler.start(
			readyClient.user
		);
	}

	/**
	 * Registers the ClientReady event with a Discord client, or calls the
	 * onReady() function if the client is already ready.
	 *
	 * @author gitrog
	 *
	 * @param {Client} client the Discord client to register the event with
	 */
	public register(client: Client): void {
		if (client.isReady()) this.onReady(client);
		else client.once(
			Events.ClientReady,
			(readyClient: Client) => this.onReady(readyClient)
		);
	}
}