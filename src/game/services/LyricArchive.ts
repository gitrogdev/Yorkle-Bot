import fs from 'node:fs';
import path from 'node:path';

import { MEDIA_ROOT } from '../../config/paths.js';
import pluralize from '../../util/pluralize.js';

export default class LyricArchive {
	/** An array containing all unique lyrics loaded in the archive. */
	private lyrics!: string[];

	/** Promise that resolves when object initilization completes. */
	public ready: Promise<void>;

	/**
	 * Constructs a new lyric archive.
	 *
	 * @author gitrog
	 *
	 * @param {string} file the name of the file to get the lyrics from
	 */
	constructor(private file: string) { this.ready = this.init(); }

	public async init() {
		const lyrics = new Set<string>();
		const lines = (await fs.promises.readFile(
			path.join(MEDIA_ROOT, this.file),
			'utf-8'
		)).split(/\r?\n/);

		for (let line of lines) {
			line = line.trim();
			if (lyrics.has(line) || line === '') continue;
			lyrics.add(line);
		}
		this.lyrics = Array.from(lyrics);
		console.log(
			'Successfully loaded '
			+ `${pluralize('unique lyric', this.lyrics.length)}.`
		);
	}

	/**
	 * Returns a random lyric.
	 *
	 * @author gitrog
	 *
	 * @returns {Promise<string>} a randomly selected song lyric from all the
	 * songs known by the bot.
	 */
	public async randomLyric(): Promise<string> {
		await this.ready;
		return this.lyrics[Math.floor(Math.random() * this.lyrics.length)];
	}
}