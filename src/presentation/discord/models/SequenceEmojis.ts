import type { SequenceCharacter } from
	'../../../game/model/SequenceCharacters.js';

/**
 * String literal values representing the emojis used to represent a results
 * sequence in a human-readable and sharable format.
 *
 * @author gitrog
 */
export const SEQUENCE_EMOJIS: Record<SequenceCharacter, string> = {
	/** The correct song. */
	O: '🟩',

	/** A skipped clip. */
	'-': '🟨',

	/** A hint was given. */
	'?': '🟧',

	/** An incorrect guess. */
	X: '🟥',

	/** An unused clip. */
	'': '⬛'
} as const;

export type SequenceEmoji = typeof SEQUENCE_EMOJIS[
	keyof typeof SEQUENCE_EMOJIS
];