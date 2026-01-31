import { parseFile } from 'music-metadata';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type SongMetadata from '../dto/SongMetadata.js';

export default class SongDataStore {
	public static readonly SONGS_PATH: string = path.join(
		path.dirname(fileURLToPath(import.meta.url)),
		'../../../songs/'
	);

	/**
	 * Loads the metadata for the songs from file.
	 *
	 * @returns {GuildInfo[]} an array of guild info, containing the stored data
	 * and the IDs
	 */
	public async load(): Promise<SongMetadata[]> {
		const songFiles = fs.readdirSync(SongDataStore.SONGS_PATH).filter(
			(file) => file.endsWith('.mp3')
		);

		const songs = [];
		for (const song of songFiles) {
			const metadata = await parseFile(
				path.join(SongDataStore.SONGS_PATH, song)
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