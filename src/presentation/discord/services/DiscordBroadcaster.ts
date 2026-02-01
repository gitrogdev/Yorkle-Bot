import type DailyResults from '../../../game/model/DailyResults.js';
import type BroadcastPort from '../../../game/ports/BroadcastPort.js';
import type Messenger from './Messenger.js';

export default class DiscordBroadcaster implements BroadcastPort {
	/**
	 * Creates a new port to receive messages for broadcast from the game.
	 *
	 * @param {Messenger} messenger the messenger service to use to send
	 * messages to Discord
	 */
	constructor(private messenger: Messenger) {}

	/**
	 * Sends the daily game results to all participating guilds, and increases
	 * their streaks.
	 *
	 * @param {DailyResults} results the daily game results
	 */
	public async sendDailyResults(results: DailyResults) {
		for (const guild of results.guilds) console.log(guild.id);
	}
}