import type { Client } from 'discord.js';

import type DailyResults from '../../../game/model/DailyResults.js';
import type BroadcastPort from '../../../game/ports/BroadcastPort.js';
import type Messenger from './Messenger.js';
import GameResultsBuilder from '../builders/GameResultsBuilder.js';
import { localize } from '../../localization/i18n.js';

export default class DiscordBroadcaster implements BroadcastPort {
	private resultsBuilder: GameResultsBuilder;

	/**
	 * Creates a new port to receive messages for broadcast from the game.
	 *
	 * @author gitrog
	 *
	 * @param {Client} client the Discord client to use for broadcast
	 * @param {Messenger} messenger the messenger service to use to send
	 * messages to Discord
	 */
	constructor(client: Client, private messenger: Messenger) {
		this.resultsBuilder = new GameResultsBuilder(client);
	}

	/**
	 * Sends the daily game results to all participating guilds, and increases
	 * their streaks.
	 *
	 * @author gitrog
	 *
	 * @param {DailyResults} results the daily game results
	 */
	public async sendDailyResults(results: DailyResults) {
		const broadcastOptions = await this.resultsBuilder.build(results);

		for (const options of broadcastOptions) await this.messenger.send(
			options.channel,
			localize(
				'game.recap',
				options.locale,
				options.i18nParams
			)
		);
	}
}