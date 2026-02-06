import {
	AttachmentBuilder,
	type ChatInputCommandInteraction
} from 'discord.js';
import type Session from '../../../game/entities/Session.js';
import type Messenger from './Messenger.js'
import { localize } from '../../localization/i18n.js';

export default class ClipPresenter {
	/**
	 * Constructs a new interface to send clips to Discord users.
	 *
	 * @author gitrog
	 *
	 * @param {Messenger} messenger the messenger to send the clips through
	 */
	constructor(private messenger: Messenger) {}

	/**
	 * Sends the next audio clip to the user.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the interaction with the
	 * user to send the clip to
	 * @param {Session} session the open session to get the clip from
	 */
	public async sendNext(
		interaction: ChatInputCommandInteraction,
		session: Session
	) {
		const clip = session.getClip();
		return await this.messenger.dm(interaction.user, {
			content: localize('game.presentclip', interaction.locale, {
				clip: clip.clip
			}),
			files: [ new AttachmentBuilder(clip.path) ]
		}).then(() => console.log(
			`Successfully presented clip ${clip.clip} to `
			+ `${interaction.user.username}.`
		));
	}
}