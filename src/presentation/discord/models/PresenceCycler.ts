import type { ClientUser } from 'discord.js';

/**
 * Abstract class used for randomly cycling through Discord presence options,
 * such as avatars or statuses, every interval seconds.
 *
 * @author gitrog
 */
export default abstract class PresenceCycler {
	/** Handle for the active timeout, or null if no timer is running. */
	protected timer: NodeJS.Timeout | null = null;

	/** The Discord client's user to update the profile picture of. */
	protected user: ClientUser | null = null;

	/** An array containing the presence strings to randomly select from. */
	protected presenceArray!: string[];

	/** A set containing all the presence strings, ensuring uniqueness. */
	protected presenceSet!: Set<string>;

	/**
	 * Creates a new Discord presence cycler and builds the presence set from
	 * the presence array.
	 *
	 * Subclass constructor must build and populate `this.presenceArray`.
	 *
	 * @author gitrog
	 *
	 * @param {number} interval the amount of time (in milliseconds) between
	 * each rotation of the status
	 */
	constructor(private interval: number) {
		this.presenceSet = this.presenceSet ?? new Set(this.presenceArray);
	}

	/**
	 * Updates the Discord presence of the bot by randomly selecting a presence
	 * string from `this.presenceArray.`
	 */
	protected abstract selectPresence(): void;

	/**
	 * Updates the Discord presence using a presence string.
	 *
	 * @param {string} presence the presence string to use to update the Discord
	 * bot's presence
	 */
	protected abstract setPresence(presence: string): void;

	/**
	 * Starts cycling through bot presences every `this.interval` seconds.
	 *
	 * @author gitrog
	 *
	 * @param {boolean} autoSet whether to immediately set the first presence
	 */
	protected cycle(autoSet: boolean): void {
		if (this.timer) clearInterval(this.timer);
		this.timer = setInterval(() => this.selectPresence(), this.interval);
		if (autoSet) this.selectPresence();
	}

	/**
	 * Adds a new presence string to the cycle.
	 *
	 * @author gitrog
	 *
	 * @param {string} presence the presence string to add to the cycle
	 * @param {boolean} autoSet whether to automatically set the presence
	 */
	public add(presence: string, autoSet: boolean = false) {
		if (this.presenceSet.has(presence)) {
			console.warn(
				`"${presence}" already exists in the ${this.constructor.name}!`
			);
			return;
		}

		this.presenceSet.add(presence);
		this.presenceArray.push(presence);

		if (autoSet) this.set(presence);
	}

	/**
	 * Manually sets the presence for the next `this.interval` seconds.
	 *
	 * @author gitrog
	 *
	 * @param {string} presence the presence to be manually set
	 */
	public set(presence: string): void {
		if (!this.user) throw new Error(
			`Attempted to set presence to ${presence} before `
			+ `${this.constructor.name} was started!`
		);

		this.stop();
		this.setPresence(presence);
		this.cycle(false);
	}

	/**
	 * Starts cycling through bot presences every `this.interval` seconds.
	 *
	 * @author gitrog
	 */
	public start(user: ClientUser): void {
		this.user = user;

		if ((!this.presenceArray) || this.presenceArray.length === 0) {
			console.warn(
				`Attempted to start a ${this.constructor.name} with no loaded `
				+ 'presence information!'
			);
			return;
		};

		this.cycle(true);

		console.log(
			`Successfully started the ${this.constructor.name} `
			+ `for @${user.tag}.`
		);
	}

	/**
	 * Stops cycling through bot presences.
	 *
	 * @author gitrog
	 */
	public stop(): void {
		if (this.timer) clearInterval(this.timer);
		else console.warn(
			`Attempted to stop a ${this.constructor.name} that was not running!`
		);
		this.timer = null;
	}
}