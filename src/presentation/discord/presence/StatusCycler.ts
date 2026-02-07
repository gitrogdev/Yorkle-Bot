import type { ClientUser } from 'discord.js';

export default class StatusCycler {
	/** Handle for the active timeout, or null if no timer is running. */
	private timer: NodeJS.Timeout | null = null;

	/** The Discord client's user to update the status of. */
	private user: ClientUser | null = null;

	/** The statuses to cycle through. */
	private statusArray: string[];

	/** A set of the statuses to cycle through, ensuring uniqueness. */
	private statusSet: Set<string>;

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
		private interval: number
	) {
		this.statusSet = new Set<string>();

		for (const status of statuses) if (this.statusSet.has(status))
			console.warn(
				`The status "${status}" appears multiple times in the statuses `
				+ 'provided to the StatusCycler!'
			);
		else this.statusSet.add(status);

		this.statusArray = Array.from(this.statusSet);
	};

	/**
	 * Picks a random status from `this.statuses` and updates the bot user's
	 * status presence.
	 *
	 * @author gitrog
	 */
	private setRandomStatus(): void {
		if (!this.user) throw new Error(
			'Attempted to set random status before StatusCycler was started!'
		);

		this.user.setActivity(this.statusArray[
			Math.floor(Math.random() * this.statusArray.length)
		]);
	}

	/**
	 * Starts cycling through bot statuses every `this.interval` seconds.
	 *
	 * @author gitrog
	 *
	 * @param {boolean} autoSet whether to immediately set the first status
	 */
	private cycle(autoSet: boolean): void {
		if (this.timer) clearInterval(this.timer);
		this.timer = setInterval(() => this.setRandomStatus(), this.interval);
		if (autoSet) this.setRandomStatus();
	}

	/**
	 * Adds a new status to the cycle.
	 *
	 * @author gitrog
	 *
	 * @param {string} status the status to add to the cycle
	 * @param {boolean} autoSet whether to automatically set the status
	 */
	public add(status: string, autoSet: boolean = false) {
		if (this.statusSet.has(status)) {
			console.warn(
				`The status "${status}" already exists in the StatusCycler!`
			);
			return;
		}

		this.statusSet.add(status);
		this.statusArray.push(status);

		if (autoSet) this.set(status);
	}

	/**
	 * Manually set the status for the next `this.interval` seconds.
	 *
	 * @author gitrog
	 *
	 * @param {string} status the status to use
	 */
	public set(status: string): void {
		if (!this.user) throw new Error(
			'Attempted to set status before StatusCycler was started!'
		);

		this.stop();
		this.user.setActivity(status);
		this.cycle(false);
	}

	/**
	 * Starts cycling through bot statuses every `this.interval` seconds.
	 *
	 * @author gitrog
	 */
	public start(user: ClientUser): void {
		this.user = user;

		if (this.statusArray.length === 0) {
			console.warn(
				'Attempted to start a StatusCycler with no loaded statuses!'
			);
			return;
		};

		this.cycle(true);

		console.log(
			`Successfully started cycling statuses for @${user.tag}.`
		);
	}

	/**
	 * Stops cycling through bot statuses.
	 *
	 * @author gitrog
	 */
	public stop(): void {
		if (this.timer) clearInterval(this.timer);
		else console.warn(
			'Attempted to stop a StatusCycler that was not running!'
		);
		this.timer = null;
	}
}