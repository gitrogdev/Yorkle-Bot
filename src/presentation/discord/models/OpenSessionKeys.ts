import type { OpenSessionResult } from
	'../../../game/model/OpenSessionResult.js';

/**
 * String literal values translating OpenSessionResults from the game layer to
 * the appropriate localization keys to use for the response to the user.
 *
 * @author gitrog
 */
export const OpenSessionKeys: Record<OpenSessionResult, string> = {
	/** The session was opened successfully. */
	OPEN: 'game.sessionopened',

	/** The user attempting to open the session already has an open session. */
	COLLISION: 'errors.sessioncollision',

	/**
	 * The user attempting to open the session has already played today's
	 * puzzle.
	 */
	PLAYED: 'errors.playedtoday'

} as const;

export type OpenSessionKeys = typeof OpenSessionKeys[
	keyof typeof OpenSessionKeys
];