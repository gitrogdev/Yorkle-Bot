import fs from 'node:fs';
import path from 'node:path';

import { MEDIA_ROOT } from '../../config/paths.js';
import pluralize from '../../util/pluralize.js';

export default class LyricArchive {
	private lyrics!: string[];
	public ready: Promise<void>;

	constructor() { this.ready = this.init(); }

	public async init() {
		const lyrics = new Set<string>();
		const lines = (await fs.promises.readFile(
			path.join(MEDIA_ROOT, 'lyrics.txt'),
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
	 * @returns {Promise<string>} a randomly selected song lyric from all the
	 * songs known by the bot.
	 */
	public async randomLyric(): Promise<string> {
		await this.ready;
		return this.lyrics[Math.floor(Math.random() * this.lyrics.length)];
	}
}