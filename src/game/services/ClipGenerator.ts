import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

import type Song from '../entities/Song.js';
import { DAYS_PATH, FFMPEG_PATH, SONGS_PATH } from '../../config/paths.js';
import padDay from '../../util/pad-day.js';

export default class ClipGenerator {
	private static execFileAsync = promisify(execFile);

	/**
	 * Constructs a new clip generator by specifying desired clip lenghths.
	 *
	 * @param {number[]} clipLengths an array of numbers containing the lengths
	 * in seconds of each clip to be generated
	 */
	constructor(private readonly clipLengths: number[]) {}

	/**
	 * Generates clips from a song based on the generator's specified clip
	 * lengths.
	 *
	 * @param {Song} song the song to generate the clips from
	 * @param {number} day the incremental day number for the game
	 */
	public async generate(song: Song, day: number) {
		const songPath = path.join(SONGS_PATH, song.filename);
		const timestamp = Math.floor(
			Math.random() * (song.length - this.clipLengths.at(-1)!)
		);

		const clipsPath = path.join(DAYS_PATH, `day${padDay(day)}`);
		await fs.promises.mkdir(clipsPath, { recursive: true });

		for (let i = 0; i < this.clipLengths.length; i++) {
			const length = this.clipLengths[i];
			await ClipGenerator.execFileAsync(FFMPEG_PATH, [
				'-y',
				'-ss', timestamp.toString(),
				'-t', length.toString(),
				'-i', songPath,
				'-map_metadata', '-1',
				'-c:a', 'copy',
				path.join(clipsPath, `clip${i + 1}.mp3`)
			]);
		};
	}
}