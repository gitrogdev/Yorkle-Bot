import { type ChatInputCommandInteraction } from 'discord.js';

import { getLocaleInfo } from '../../../localization/i18n.js';
import type Messenger from '../Messenger.js';
import { env } from '../../../../config/env.js';

export default class MetaInteractionHandler {
	/**
	 * Creates a new interface for interactions between bot commands and the
	 * Yorkle game's metadata.
	 *
	 * @author gitrog
	 *
	 * @param {string} version the version number for the application
	 * @param {Messenger} messenger the messenger interface to send messages to
	 * Discord
	 */
	constructor(
		public readonly version: string,
		private messenger: Messenger
	) {}

	/**
	 * Responds with the information about the user's active locale.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting locale info
	 */
	public async getLocaleInfo(interaction: ChatInputCommandInteraction) {
		return await this.messenger.reply(
			interaction, getLocaleInfo(interaction.locale)
		);
	}

	/**
	 * Responds with the relative time until the game resets.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the time
	 */
	public async getNextGameTime(interaction: ChatInputCommandInteraction) {
		const now = Math.floor(new Date().getTime() / 1000);
		return await this.messenger.localizedReply(
			interaction, 'commands.whennext.response', {
				timestamp: `<t:${now - (now % 86_400) + 86_400}:R>`
			}
		);
	}

	/**
	 * Responds with the information for contacting support.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting support info
	 */
	public async getSupportInfo(interaction: ChatInputCommandInteraction) {
		return await this.messenger.localizedReply(
			interaction,
			'bot.supportinfo',
			{
				dev: `<@${env.DEVELOPER_ID}>`,
				server:
					`https://discord.gg/${env.DEVELOPER_SERVER_INVITE!}`
			}, {
				allowedMentions: { users: [] }
			}
		);
	}

	/**
	 * Responds with the version of Yorkle the bot is currently running on.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the version
	 */
	public async getVersion(interaction: ChatInputCommandInteraction) {
		return await this.messenger.localizedReply(
			interaction, 'bot.version', { version: this.version }
		);
	}
}