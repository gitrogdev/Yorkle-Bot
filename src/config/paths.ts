import path from 'node:path';

export const DATA_ROOT = process.env.DATA_ROOT ?? path.resolve('data');

export const SRC_ROOT = path.resolve('src');

export const DAYS_PATH = path.join(DATA_ROOT, 'days');

export const FFMPEG_PATH =
	process.env.FFMPEG_PATH ?? 'C:/ffmpeg/bin/ffmpeg.exe';

export const GUILDS_PATH = path.join(DATA_ROOT, 'guilds');

export const LOCALIZATION_PATH = path.join(
	SRC_ROOT, 'presentation', 'localization'
);

export const MEDIA_ROOT = process.env.MEDIA_ROOT ?? path.resolve('media');

export const QUEUE_PATH = path.join(DATA_ROOT, 'game-queue.json');

export const SONGS_PATH = process.env.SONGS_PATH ?? path.resolve('songs');