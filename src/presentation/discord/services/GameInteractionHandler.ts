import type { ChatInputCommandInteraction } from 'discord.js';
import type Yorkle from '../../../game/Yorkle.js';
import toUserIdentity from '../mappers/to-user-identity.js';
import { localize } from '../../../localization/i18n.js';

export default class GameInteractionHandler {
	constructor(private game: Yorkle) {}

	public async newGame(interaction: ChatInputCommandInteraction) {
		const response = await this.game.sessions.open(
			toUserIdentity(interaction.user)
		);

		await interaction.editReply(localize(
			response.result === 'OPEN' ? 'game.sessionopened' :
				response.result === 'COLLISION' ? 'game.sessioncollision' :
					'game.playedtoday', interaction.locale
		)).catch();
	}
}