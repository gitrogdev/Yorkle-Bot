import { Events, type Client } from 'discord.js';

import type CommandRouter from '../services/CommandRouter.js';
import DiscordEvent from './DiscordEvent.js';

export default class InteractionCreateEvent extends DiscordEvent {
	/**
	 * Creates a new InteractionCreateEvent.
	 *
	 * @param {CommandRouter} router the command router to route slash commands
	 * to
	 */
	constructor(private readonly router: CommandRouter) { super(); }

	public register(client: Client): void {
		client.on(Events.InteractionCreate, (i) => this.router.route(i));
	}
}