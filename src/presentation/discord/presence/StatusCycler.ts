import type { ClientUser } from 'discord.js';
import PresenceCycler from '../models/PresenceCycler.js';

export default class StatusCycler extends PresenceCycler {
	/**
	 * Creates a new cycler to loop through different Discord status presences
	 * for the bot user.
	 *
	 * @author gitrog
	 *
	 * @param {string[]} statuses an array of all potential statuses for the bot
	 * @param {number} interval the amount of time (in milliseconds) between
	 * each rotation of the status
	 */
	constructor(
		statuses: string[],
		interval: number
	) {
		super(interval);
		this.presenceSet = new Set<string>();

		for (const status of statuses) if (this.presenceSet.has(status))
			console.warn(
				`The status "${status}" appears multiple times in the statuses `
				+ 'provided to the StatusCycler!'
			);
		else this.presenceSet.add(status);

		this.presenceArray = Array.from(this.presenceSet);
	};

	/**
	 * Randomly updates the bot's status.
	 *
	 * @author gitrog
	 */
	protected selectPresence(): void {
		this.setPresence(this.presenceArray[
			Math.floor(Math.random() * this.presenceArray.length)
		]);
	}

	/**
	 * Updates the bot's status.
	 *
	 * @author gitrog
	 *
	 * @param {string} presence the string to set the bot's status to
	 */
	protected setPresence(presence: string): void {
		if (!this.user) throw new Error(
			'Attempted to set random status before StatusCycler was started!'
		);

		this.user.setActivity(presence);
	}
}