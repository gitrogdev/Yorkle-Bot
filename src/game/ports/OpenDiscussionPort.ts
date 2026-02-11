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
	 * Opens a thread for postgame discussion, overwriting it if it already
	 * exists.
	 *
	 * @author gitrog
	 *
	 * @param {string} guildId the guild to open the discussion thread in
	 *
	 * @returns {Promise<string>} a promise of the ID of the discussion thread
	 * created
	 */
	openPostgameThread(guildId: string): Promise<string>;

	/**
	 * Passes the thread for an already open postgame discussion to the client
	 * to be stored on the client.
	 *
	 * @author gitrog
	 *
	 * @param {string} guildId the ID of the guild which the thread is in
	 * @param {string} threadId the ID of the discussion thread
	 */
	restorePostgameThread(guildId: string, threadId: string): Promise<void>;
}