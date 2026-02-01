import {
	AttachmentBuilder,
	type ChatInputCommandInteraction
} from 'discord.js';

import type Yorkle from '../../../game/Yorkle.js';
import toUserIdentity from '../mappers/to-user-identity.js';
import { localize } from '../../../localization/i18n.js';
import type Session from '../../../game/entities/Session.js';

export default class GameInteractionHandler {
	constructor(private game: Yorkle) {}

	/**
	 * Sends the next audio clip to the user.
	 *
	 * @param {ChatInputCommandInteraction} interaction the interaction with the
	 * user to send the clip to
	 * @param {Session} session the open session to get the clip from
	 */
	private async sendClip(
		interaction: ChatInputCommandInteraction,
		session: Session
	) {
		const clip = session.getClip();
		interaction.user.send({
			content: localize('game.presentclip', interaction.locale, {
				clip: clip.clip
			}),
			files: [ new AttachmentBuilder(clip.path) ]
		}).then(() => console.log(
			`Successfully presented clip ${clip.clip} to `
			+ `${interaction.user.username}.`
		)).catch();
	}

	/**
	 * Attempts to start a new session of the game for a user.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user starting the game
	 */
	public async newGame(interaction: ChatInputCommandInteraction) {
		const response = await this.game.sessions.open(
			toUserIdentity(interaction.user)
		);

		await interaction.editReply(localize(
			response.result === 'OPEN' ? 'game.sessionopened' :
				response.result === 'COLLISION' ? 'game.sessioncollision' :
					'game.playedtoday', interaction.locale
		)).catch();

		if (response.result === 'OPEN') this.sendClip(
			interaction, response.session!
		);
	}
}