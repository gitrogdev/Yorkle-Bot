import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Represents the validated and normalized environment variables required for
 * the application to run.
 *
 * @author gitrog
 */
export type EnvironmentVariables = Readonly<{
	/** The secret token for the Discord bot. */
	DISCORD_TOKEN: string,

	/** The application ID of the Discord application. */
	APPLICATION_ID: string,

	/** The Discord user ID of the main developer of the application. */
	DEVELOPER_ID: string,

	/**
	 * The Discord invite code (excluding the link) to the project server for
	 * the application.
	 */
	DEVELOPER_SERVER_INVITE: string,

	/** Root directory under which all application data is stored. */
	DATA_ROOT: string,

	/** Absolute path to the ffmpeg executable. */
	FFMPEG_PATH: string,

	/** Root directory under which all media files are stored. */
	MEDIA_ROOT: string,

	/** Root directory under which all song .mp3 files are stored. */
	SONGS_ROOT: string,

	/**
	 * Whether to enable more detailed console logging for developers which may
	 * contain game spoilers.
	 */
	DEV_MODE: boolean
}>;

/**
 * Validates a required environment variable.
 *
 * @author gitrog
 *
 * @param {string} varName the key of the required environment variable
 *
 * @returns {string} the value of the environment variable
 */
function validateRequired(varName: string): string {
	const envVariable = process.env[varName];
	if (!envVariable || envVariable.trim() === '') throw new Error(
		`Failed to load environment variable ${varName}!`
	);

	return envVariable.trim();
}

/**
 * Validates an optional environment variable, replacing it with a default value
 * if not defined.
 *
 * @author gitrog
 *
 * @param {string} varName the key of the optional environment variable
 * @param {string} defaultTo the value to default to if the environment variable
 * is not defined
 *
 * @returns {string} the value of the environment variable
 */
function validateOptional(varName: string, defaultTo: string): string {
	const envVariable = process.env[varName];

	return envVariable?.trim() || defaultTo;
}

/**
 * Interprets an environment variable as a boolean, returning false if it is
 * not defined or contains an invalid value.
 *
 * @author gitrog
 *
 * @param varName the key of the boolean environment variable
 *
 * @returns {boolean} the value of the environment variable interpreted as a
 * boolean
 */
function validateBoolean(varName: string): boolean {
	const envVariable = process.env[varName];
	return envVariable?.trim().toLowerCase() === 'true';
}

/**
 * Interprets an environment variable as a path, replacing it with a default
 * value if not defined or if the path is defined but does not exist.
 *
 * @author gitrog
 *
 * @param {string} varName the key of the path environment variable
 * @param {string} defaultTo the value to default to if the environment variable
 * is not defined or if the path is not found
 *
 * @returns {string} the value of the environment variable
 */
function validatePath(varName: string, defaultTo: string): string {
	const envVariable = process.env[varName];

	return envVariable && existsSync(envVariable) ? envVariable : defaultTo;
}

/**
 * Validated and immutable runtime environment configuration.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	DISCORD_TOKEN: 'your_secret_token',
 * 	APPLICATION_ID: '1234567890123456789',
 *
 * 	DEVELOPER_ID: '966923213214990366',
 * 	DEVELOPER_SERVER_INVITE: 'CWNpKctszg',
 *
 * 	DATA_ROOT: './data',
 * 	FFMPEG_PATH: 'C:/ffmpeg/bin/ffmpeg.exe',
 * 	MEDIA_ROOT: './media',
 * 	SONGS_ROOT: './songs',
 *
 * 	DEV_MODE: false
 * }
 */
export const env: EnvironmentVariables = Object.freeze({
	DISCORD_TOKEN: validateRequired('DISCORD_TOKEN'),
	APPLICATION_ID: validateRequired('APPLICATION_ID'),

	DEVELOPER_ID: validateOptional('DEVELOPER_ID', '966923213214990366'),
	DEVELOPER_SERVER_INVITE: validateOptional(
		'DEVELOPER_SERVER_INVITE',
		'CWNpKctszg'
	),

	DATA_ROOT: validatePath('DATA_ROOT', path.resolve('data')),
	FFMPEG_PATH: validatePath('FFMPEG_PATH', 'C:/ffmpeg/bin/ffmpeg.exe'),
	MEDIA_ROOT: validatePath('MEDIA_ROOT', path.resolve('media')),
	SONGS_ROOT: validatePath('SONGS_ROOT', path.resolve('songs')),

	DEV_MODE: validateBoolean('DEV_MODE')
});