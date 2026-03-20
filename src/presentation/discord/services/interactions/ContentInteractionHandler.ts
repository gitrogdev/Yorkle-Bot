import { type ChatInputCommandInteraction } from 'discord.js';

import type Yorkle from '../../../../game/Yorkle.js';
import { localePluralize } from '../../../localization/i18n.js';
import type Messenger from '../Messenger.js';
import { LyricOption } from '../../../../game/model/LyricOption.js';

export default class ContentInteractionHandler {
	/**
	 * Creates a new interface for interactions between bot commands and the
	 * Yorkle game's content.
	 *
	 * @author gitrog
	 *
	 * @param {Yorkle} game the Yorkle game for the Discord client to interact
	 * with
	 * @param {Messenger} messenger the messenger interface to send messages to
	 * Discord
	 */
	constructor(
		private game: Yorkle,
		private messenger: Messenger
	) {}

	/**
	 * Responds with a human-readable representation of the contents of the
	 * game.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the content
	 */
	public async getContent(interaction: ChatInputCommandInteraction) {
		const songCount = this.game.countSongs();

		return await this.messenger.localizedReply(
			interaction,
			'game.contents',
			{
				songs: localePluralize(
					interaction.locale,
					'plurals.uniquesong',
					songCount
				)
			}
		);
	}

	/**
	 * Responds with a random song lyric.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the lyric
	 * @param {LyricOption} archive the archive to get the lyric from
+	 */
	public async randomLyric(
		interaction: ChatInputCommandInteraction,
		archive: LyricOption
	) {
		return await this.messenger.reply(
			interaction,
			await this.game.randomLyric(archive)
		);
	}
}