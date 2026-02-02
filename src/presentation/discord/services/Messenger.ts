import type { ChatInputCommandInteraction, Client, User } from 'discord.js';

import type { MessageOptions } from '../models/MessageOptions.js';
import type { SafeReplyOptions } from '../models/SafeReplyOptions.js';
import type { EditOptions } from '../models/EditOptions.js';
import type { ReplyOptions } from '../models/ReplyOptions.js';

export default class Messenger {
	/**
	 * Builds a new service for safely sending messages.
	 *
	 * @param {Client} client the Discord client to use for sending messages
	 */
	constructor(private client: Client) {}

	/**
	 * Safely send a direct message to a user.
	 *
	 * @param {User} user the user to send a direct message to
	 * @param {MessageOptions} options the options for the payload containing
	 * the message's contents to send to Discord
	 */
	public async dm(user: User, options: MessageOptions) {
		try {
			return await user.send(options);
		} catch (exception) {
			console.warn(
				`Failed to send a direct message to ${user.username}: `,
				exception
			);
		}
	}

	/**
	 * Safely reply to an interaction.
	 *
	 * @param {ChatInputCommandInteraction} interaction the interaction to
	 * reply to
	 * @param {SafeReplyOptions} options the options for the payload containing
	 * the reply's contents to send to Discord
	 */
	public async reply(
		interaction: ChatInputCommandInteraction,
		options: SafeReplyOptions
	) {
		try {
			if (interaction.deferred || interaction.replied)
				return await interaction.editReply(options as EditOptions);
			else return await interaction.reply(options as ReplyOptions);
		} catch (exception) {
			console.warn('Failed to reply to interaction: ', exception);
			return null;
		}
	}
}