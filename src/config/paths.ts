import path from 'node:path';

export const DATA_ROOT = process.env.DATA_ROOT ?? path.resolve('data');

export const DAYS_PATH = path.join(DATA_ROOT, 'days');

export const FFMPEG_PATH =
	process.env.FFMPEG_PATH ?? 'C:/ffmpeg/bin/ffmpeg.exe';

export const GUILDS_PATH = path.join(DATA_ROOT, 'guilds');

export const QUEUE_PATH = path.join(DATA_ROOT, 'game-queue.json');

export const SONGS_PATH = process.env.SONGS_PATH ?? path.resolve('songs');