import type { ClientUser } from 'discord.js';

export default class StatusCycler {
	private timer: NodeJS.Timeout | null = null;
	private user: ClientUser | null = null;
	private statuses: string[];

	/**
	 * Creates a new cycler to loop through different Discord status presences
	 * for the bot user.
	 *
	 * @param {string[]} statuses an array of all potential statuses for the bot
	 * @param {number} interval the amount of time (in milliseconds) between
	 * each rotation of the status
	 */
	constructor(
		statuses: string[],
		private interval: number
	) {
		this.statuses = [];
		for (const status of statuses) if (this.statuses.includes(status))
			console.warn(
				`The status "${status}" appears multiple times in the statuses `
				+ 'provided to the StatusCycler!'
			);
		else this.statuses.push(status);
	};

	/**
	 * Picks a random status from `this.statuses` and updates the bot user's
	 * status presence.
	 */
	private setRandomStatus(): void {
		if (!this.user) throw new Error(
			'Attempted to set random status before StatusCycler was started!'
		);

		this.user.setActivity(
			this.statuses[Math.floor(Math.random() * this.statuses.length)]
		);
	}

	/**
	 * Starts cycling through bot statuses every `this.interval` seconds.
	 *
	 * @param {boolean} autoSet whether to immediately set the first status
	 */
	private cycle(autoSet: boolean): void {
		this.timer = setInterval(this.setRandomStatus, this.interval);
		if (autoSet) this.setRandomStatus();
	}

	/**
	 * Adds a new status to the cycle.
	 *
	 * @param {string} status the status to add to the cycle
	 * @param {boolean} set whether to automatically set the status
	 */
	public add(status: string, set?: boolean) {
		if (status in this.statuses) {
			console.warn(
				`The status "${status}" already exists in the StatusCycler!`
			);
			return;
		}

		this.statuses.push(status);
		if (set) this.set(status);
	}

	/**
	 * Manually set the status for the next `this.interval` seconds.
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
	 */
	public start(user: ClientUser): void {
		this.user = user;

		if (this.statuses.length === 0) {
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
	 */
	public stop(): void {
		if (this.timer) clearInterval(this.timer);
		else console.warn(
			'Attempted to stop a StatusCycler that was not running!'
		);
		this.timer = null;
	}
}