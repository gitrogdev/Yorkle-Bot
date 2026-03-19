import { HintOption } from '../model/HintOption.js';
import Song from './Song.js';

/**
 * Contains the information about a hint given to a player based on their
 * previous guesses.
 *
 * @author gitrog
 */
export default class Hint {
	/** The localization key for the body of the hint. */
	private key: HintOption;

	/**
	 * Parameters for localization to be inserted into a formatted string as is.
	 */
	private literalParams?: Record<string, string>;

	/**
	 * Parameters for localization to be used as localization keys, then
	 * inserted into a formatted string.
	 */
	private keyParams?: Record<string, [string, number?]>;

	/**
	 * Builds a hint for a player based on the songs the player has already
	 * guessed, the hints the player has already been given, and the correct
	 * answer.
	 *
	 * @author gitrog
	 *
	 * @param {Set<Song>} guesses the songs the player has already guessed
	 * @param {Set<HintOption>} hints the hints the player has been given
	 * @param {Song} correct the correct song
	 */
	constructor(guesses: Set<Song>, hints: Set<HintOption>, correct: Song) {
		for (const song of guesses) if (song.album === correct.album) {
			this.literalParams = { compare: song.title };
			if (hints.has(HintOption.Album)) {
				this.key = correct.length > song.length ? HintOption.Longer :
					HintOption.Shorter;
				return;
			}
			this.key = HintOption.Album;
			return;
		}

		if (!hints.has(HintOption.Artist)) for (const song of guesses) if (
			song.artist === correct.artist
			&& song.artist !== Song.DEFAULT_ARTIST
		) {
			this.key = HintOption.Artist;
			this.literalParams = { compare: song.title };
			return;
		}

		let diff = Number.MAX_SAFE_INTEGER;
		let checkDiff, compare;
		for (const song of guesses) {
			checkDiff = song.year
			if (Math.abs(checkDiff) < Math.abs(diff)) {
				compare = song;
				diff = checkDiff;
			}
		}

		if (diff === 0) {
			this.key = HintOption.DiffSame;
			this.literalParams = { compare: compare!.title };
			return;
		}

		const absDiff = Math.abs(diff);
		this.key = absDiff > 9 ? HintOption.DiffDecade
			: absDiff > 4 ? HintOption.DiffSeveral
				: absDiff > 1 ? HintOption.DiffFew
					: HintOption.DiffSame;
		this.literalParams = { compare: compare!.title };
		this.keyParams = {
			relation: [diff < 0 ? 'options.before' : 'options.after']
		}
		if (this.key === HintOption.DiffDecade) this.keyParams.gap = [
			'plurals.decade',
			Math.floor(absDiff / 10)
		];
	}

	/**
	 * Returns the localization key for the body of the hint.
	 *
	 * @author gitrog
	 *
	 * @returns the localization key for the body of the hint
	 */
	public getKey(): HintOption { return this.key; }

	/**
	 * Returns the parameters for localization to be inserted into a formatted
	 * string as is.
	 *
	 * @author gitrog
	 *
	 * @returns the parameters for localization to be inserted into a formatted
	 * string as is, or undefined if none have been assigned.
	 */
	public getLiteralParams(): Record<string, string> | undefined {
		return this.literalParams;
	}

	/**
	 * Returns the parameters for localization to be used as localization keys,
	 * then inserted into a formatted string.
	 *
	 * @author gitrog
	 *
	 * @returns the parameters for localization to be used as localization keys,
	 * then inserted into a formatted string, or undefined if none have been
	 * assigned.
	 */
	public getKeyParams(): Record<string, [string, number?]> | undefined {
		return this.keyParams;
	}
}