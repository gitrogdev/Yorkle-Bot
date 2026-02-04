import { parseFile } from 'music-metadata';
import fs from 'node:fs';
import path from 'node:path';

import type SongMetadata from '../dto/SongMetadata.js';
import { SONGS_ROOT } from '../../config/paths.js';

export default class SongDataStore {
	/**
	 * Loads the metadata for the songs from file.
	 *
	 * @returns {GuildInfo[]} an array of guild info, containing the stored data
	 * and the IDs
	 */
	public async load(): Promise<SongMetadata[]> {
		const songFiles = fs.readdirSync(SONGS_ROOT).filter(
			(file) => file.endsWith('.mp3')
		);

		const songs = [];
		for (const song of songFiles) {
			const metadata = await parseFile(
				path.join(SONGS_ROOT, song)
			);
			const { title, artist, album } = metadata.common;
			const duration = metadata.format.duration;
			songs.push({
				title: title,
				artist: artist,
				album: album,
				song: song,
				duration: duration
			});
		}

		return songs;
	}
}