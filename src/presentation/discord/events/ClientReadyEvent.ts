import { Events, type Client } from 'discord.js';

import DiscordEvent from './DiscordEvent.js';
import StatusCycler from '../presence/StatusCycler.js';

export default class ClientReadyEvent extends DiscordEvent {
	/**
	 * Creates a new ClientReadyEvent.
	 *
	 * @param {StatusCycler} statuses the StatusCycler to use to loop through
	 * statuses
	 */
	constructor(private statuses: StatusCycler) { super(); };

	private onReady(readyClient: Client) {
		if (!readyClient.user) throw new Error(
			'Failed to initialize client: Discord client is ready but user '
			+ 'is null.'
		);

		console.log(
			`Successfully initialized client as @${readyClient.user.tag}.`
		);

		this.statuses.start(readyClient.user);
	}

	/**
	 * Registers the ClientReady event with a Discord client, or calls the
	 * onReady() function if the client is already ready.
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