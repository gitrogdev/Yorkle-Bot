import type { Client } from 'discord.js';

export default abstract class DiscordEvent {
	/**
	 * Registers the event with a Discord client.
	 *
	 * @param {Client} client the Discord client to register the event with
	 */
	public abstract register(client: Client): void;
}