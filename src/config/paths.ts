import path from 'node:path';

import { env } from './env.js';

/** Root directory under which all application data is stored. */
export const DATA_ROOT = env.DATA_ROOT;

/** Root directory under which all TypeScript source code is stored. */
export const SRC_ROOT = path.resolve('src');

/** Path to the directory where data for each day of the game is stored. */
export const DAYS_PATH = path.join(DATA_ROOT, 'days');

/** Absolute path to the ffmpeg executable. */
export const FFMPEG_PATH = env.FFMPEG_PATH;

/** Path to the directory where data for each guild is stored. */
export const GUILDS_PATH = path.join(DATA_ROOT, 'guilds');

/** Path to the localization directory. */
export const LOCALIZATION_PATH = path.join(
	SRC_ROOT, 'presentation', 'localization'
);

/** Root directory under which all media files are stored. */
export const MEDIA_ROOT = env.MEDIA_ROOT;

/** Path to the directory where all lyrics .txt files are stored. */
export const LYRICS_PATH = path.join(MEDIA_ROOT, 'lyrics');

/** Path to the file containing queue data. */
export const QUEUE_PATH = path.join(DATA_ROOT, 'game-queue.json');

/** Path to the directory where all song .mp3 files are stored. */
export const SONGS_PATH = path.join(MEDIA_ROOT, 'songs');