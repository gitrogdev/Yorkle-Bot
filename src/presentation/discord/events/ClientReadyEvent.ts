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

	public register(client: Client): void {
		client.once(Events.ClientReady, (readyClient: Client) => {
			if (!readyClient.user) throw new Error(
				'Failed to initialize client: Discord client is ready but user '
				+ 'is null.'
			);

			console.log(
				`Successfully initialized client as @${readyClient.user.tag}.`
			);

			this.statuses.start(readyClient.user);
		});
	}
}