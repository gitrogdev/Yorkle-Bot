import type { ClientUser } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Used for cycling through bot avatars (profile pictures).
 * 
 * @author gitrog
 */
export default class AvatarCycler {
	/** Handle for the active timeout, or null if no timer is running. */
	private timer: NodeJS.Timeout | null = null;

	/** The Discord client's user to update the profile picture of. */
	private user: ClientUser | null = null;

	/** An array containing file paths to all avatar images for the bot. */
	private avatarArray: string[];

	/** A set of the file paths to all avatar images, ensuring uniqueness. */
	private avatarSet: Set<string>;

	/**
	 * Creates a new cycler to loop through different Discord status presences
	 * for the bot user.
	 *
	 * @author gitrog
	 *
	 * @param {string} avatarsPath the path for the directory containing the
	 * profile pictures to cycle through
	 * @param {number} interval the amount of time (in milliseconds) between
	 * each rotation of the status
	 */
	constructor(
		avatarsPath: string,
		private interval: number
	) {
		const avatarImages = fs.readdirSync(avatarsPath).filter(img => {
			return /\.(png|jpg)$/i.test(img) 
		});
		this.avatarArray = avatarImages.map(img => path.join(avatarsPath, img));
		this.avatarSet = new Set(this.avatarArray);
	};

	/**
	 * Picks a random avatar from `this.avatarArray` and updates the bot avatar
	 * (profile picture).
	 *
	 * @author gitrog
	 */
	private setRandomAvatar(): void {
		if (!this.user) throw new Error(
			'Attempted to set random avatar before AvatarCycler was started!'
		);

		this.user.setAvatar(this.avatarArray[
			Math.floor(Math.random() * this.avatarArray.length)
		]);
	}

	/**
	 * Starts cycling through avatars every `this.interval` seconds.
	 *
	 * @author gitrog
	 *
	 * @param {boolean} autoSet whether to immediately set the first avatar
	 */
	private cycle(autoSet: boolean): void {
		if (this.timer) clearInterval(this.timer);
		this.timer = setInterval(() => this.setRandomAvatar(), this.interval);
		if (autoSet) this.setRandomAvatar();
	}

	/**
	 * Adds a new avatar to the cycle.
	 *
	 * @author gitrog
	 *
	 * @param {string} avatarPath the file path to the profile picture to add to
	 * the cycle
	 * @param {boolean} autoSet whether to automatically set the avatar
	 */
	public add(avatarPath: string, autoSet: boolean = false) {
		if (this.avatarSet.has(avatarPath)) {
			console.warn(
				`The avatar "${avatarPath}" already exists in the AvatarCycler!`
			);
			return;
		}

		this.avatarSet.add(avatarPath);
		this.avatarArray.push(avatarPath);

		if (autoSet) this.set(avatarPath);
	}

	/**
	 * Manually set the avatar for the next `this.interval` seconds.
	 *
	 * @author gitrog
	 *
	 * @param {string} avatarPath the file path to the profile picture to set
	 */
	public set(avatarPath: string): void {
		if (!this.user) throw new Error(
			'Attempted to set avatar before AvatarCycler was started!'
		);

		this.stop();
		this.user.setActivity(avatarPath);
		this.cycle(false);
	}

	/**
	 * Starts cycling through bot avatars every `this.interval` seconds.
	 *
	 * @author gitrog
	 */
	public start(user: ClientUser): void {
		this.user = user;

		if (this.avatarArray.length === 0) {
			console.warn(
				'Attempted to start a AvatarCycler with no loaded avatars!'
			);
			return;
		};

		this.cycle(true);

		console.log(
			`Successfully started cycling avatars for @${user.tag}.`
		);
	}

	/**
	 * Stops cycling through bot avatars.
	 *
	 * @author gitrog
	 */
	public stop(): void {
		if (this.timer) clearInterval(this.timer);
		else console.warn(
			'Attempted to stop an AvatarCycler that was not running!'
		);
		this.timer = null;
	}
}