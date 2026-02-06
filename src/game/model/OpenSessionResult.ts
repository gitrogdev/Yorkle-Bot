/**
 * String literal values representing the possible options for a response from
 * the session manager on attempting to open a session.
 *
 * @author gitrog
 */
export const OpenSessionResult = {
	/** The session was opened successfully. */
	Open: 'OPEN',

	/** The user attempting to open the session already has an open session. */
	Collision: 'COLLISION',

	/**
	 * The user attempting to open the session has already played today's
	 * puzzle.
	 */
	Played: 'PLAYED'

} as const;

export type OpenSessionResult = typeof OpenSessionResult[
	keyof typeof OpenSessionResult
];