import type GuildJson from './GuildJson.js';

/**
 * Information about an individual guild for the game to run in.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	id: '1234567890',
 * 	data: GuildJson
 * }
 */
export default interface GuildInfo {
	/** A unique identifier representing the guild. */
	id: string,

	/** JSON-serializable representation of the guild's data. */
	data: GuildJson
};