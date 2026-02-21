import fs from 'node:fs';
import path from 'node:path';
import PresenceCycler from '../models/PresenceCycler.js';

/**
 * Used for cycling through bot avatars (profile pictures).
 *
 * @author gitrog
 */
export default class AvatarCycler extends PresenceCycler {
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
		interval: number
	) {
		super(interval);

		const avatarImages = fs.readdirSync(avatarsPath).filter(img => {
			return /\.(png|jpg)$/i.test(img)
		});
		this.presenceArray = avatarImages.map(
			img => path.join(avatarsPath, img)
		);
		this.presenceSet = new Set(this.presenceArray);
	};

	/**
	 * Randomly updates the bot's avatar (profile picture).
	 *
	 * @author gitrog
	 */
	protected selectPresence(): void {
		this.setPresence(this.presenceArray[
			Math.floor(Math.random() * this.presenceArray.length)
		]);
	}

	/**
	 * Updates the bot's avatar (profile picture).
	 *
	 * @author gitrog
	 *
	 * @param {string} presence the file path to the image to set as the bot's
	 * avatar
	 */
	protected setPresence(presence: string): void {
		if (!this.user) throw new Error(
			'Attempted to set random avatar before AvatarCycler was started!'
		);

		this.user.setAvatar(presence).then(() => console.log(
			`Successfully set avatar to ${presence}.`
		));
	}
}