import type Guild from '../entities/Guild.js';
import type UserIdentity from '../model/UserIdentity.js';

/**
 * Port interface for opening discussion threads on the client.
 *
 * Presentation layer should implement the interface and its methods, and game
 * layer will broadcast to the attached interface.
 *
 * @author gitrog
 */
export default interface PostgameDiscussionPort {
	/**
	 * Adds a user to all postgame discussion threads for a day's iteration of
	 * the game.
	 *
	 * @author gitrog
	 *
	 * @param {UserIdentity} user a representation of the information of the
	 * user to add to the threads
	 * @param {number} day the number of the day of the game's iteration for the
	 * user to join the threads of
	 */
	joinPostgameThreads(user: UserIdentity, day: number): Promise<void>

	/**
	 * Opens a thread for postgame discussion for the provided day.
	 *
	 * @author gitrog
	 *
	 * @param {Guild} guild the guild to open the discussion thread in
	 * @param {number} day the number of the day of the game's iteration to
	 * associate the thread with
	 */
	openPostgameThread(guild: Guild, day: number): Promise<void>;

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