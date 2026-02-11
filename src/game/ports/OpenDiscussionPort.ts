import type Guild from '../entities/Guild.js';

/**
 * Port interface for opening discussion threads on the client.
 *
 * Presentation layer should implement the interface and its methods, and game
 * layer will broadcast to the attached interface.
 *
 * @author gitrog
 */
export default interface OpenDiscussionPort {
	/**
	 * Opens a thread for postgame discussion for the provided day.
	 *
	 * @author gitrog
	 *
	 * @param {Guild} guild the guild to open the discussion thread in
	 * @param {number} day the number of the day of the game's iteration to
	 * associate the thread with
	 *
	 * @returns {Promise<string>} a promise of the ID of the discussion thread
	 * created
	 */
	openPostgameThread(guild: Guild, day: number): Promise<string>;

	/**
	 * Passes the thread for an already open postgame discussion to the client
	 * to be stored on the client.
	 *
	 * @author gitrog
	 *
	 * @param {Guild} guild the guild to which the discussion thread is in
	 */
	restorePostgameThread(guild: Guild): Promise<void>;
}