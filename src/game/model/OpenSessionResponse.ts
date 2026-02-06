import type Session from '../entities/Session.js';
import type { OpenSessionResult } from './OpenSessionResult.js';

/**
 * Contains information about the response from the session manager upon
 * attempting to open a session.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	result: OpenSessionResult
 * 	session: Session
 * }
 */
export default interface OpenSessionResponse {
	/**
	 * The result of attempting to open the session.
	 *
	 * @see {@link OpenSessionResult}
	 */
	result: OpenSessionResult,

	/**
	 * The session opened by the session manager, if it exists.
	 *
	 * @see {@link Session}
	 */
	session?: Session
}