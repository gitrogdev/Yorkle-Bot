import { Events, type Client } from 'discord.js';
import DiscordEvent from './DiscordEvent.js';

export default class ClientReadyEvent extends DiscordEvent {
	public register(client: Client): void {
		client.once(Events.ClientReady, (readyClient: Client) => {
			if (!readyClient.user) throw new Error(
				'Failed to initialize client: Discord client is ready but user '
				+ 'is null.'
			);

			console.log(
				`Successfully initialized client as @${readyClient.user.tag}.`
			);
		});
	}
}