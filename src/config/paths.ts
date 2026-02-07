import path from 'node:path';

/** Root directory under which all application data is stored. */
export const DATA_ROOT = process.env.DATA_ROOT ?? path.resolve('data');

/** Root directory under which all TypeScript source code is stored. */
export const SRC_ROOT = path.resolve('src');

/** Path to the directory where data for each day of the game is stored. */
export const DAYS_PATH = path.join(DATA_ROOT, 'days');

/** Absolute path to the ffmpeg executable. */
export const FFMPEG_PATH =
	process.env.FFMPEG_PATH ?? 'C:/ffmpeg/bin/ffmpeg.exe';

/** Path to the directory where data for each guild is stored. */
export const GUILDS_PATH = path.join(DATA_ROOT, 'guilds');

/** Path to the localization directory. */
export const LOCALIZATION_PATH = path.join(
	SRC_ROOT, 'presentation', 'localization'
);

/** Root directory under which all media files are stored. */
export const MEDIA_ROOT = process.env.MEDIA_ROOT ?? path.resolve('media');

/** Path to the file containing queue data. */
export const QUEUE_PATH = path.join(DATA_ROOT, 'game-queue.json');

/** Root directory under which all song .mp3 files are stored. */
export const SONGS_ROOT = process.env.SONGS_ROOT ?? path.resolve('songs');