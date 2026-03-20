import { type ChatInputCommandInteraction } from 'discord.js';

import type Yorkle from '../../../../game/Yorkle.js';
import type Messenger from '../Messenger.js';
import SequencePresenter from '../SequencePresenter.js';

export default class UserInteractionHandler {
	/**
	 * A presenter to convert sequences saved to file to a human-readable
	 * format.
	 */
	private sequencePresenter: SequencePresenter = new SequencePresenter();

	/**
	 * Creates a new interface for interactions between bot commands and the
	 * Yorkle game pertaining to user data.
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
	 * Attempts to share the results for today's game.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user sharing their game results
	 */
	public async shareResults(interaction: ChatInputCommandInteraction) {
		const game = await this.game.getGame();
		const response = game.getResult(interaction.user.id);

		if (interaction.guild) await this.game.joinGuild(
			interaction.guild.id,
			interaction.user.id
		);

		return await this.messenger.localizedReply(
			interaction,
			response.sequence ? 'game.results' : 'errors.hasntplayed',
			{
				day: response.day,
				...(response.sequence ? {
					sequence: this.sequencePresenter.build(response.sequence)
				} : {})
			}
		);
	}
}