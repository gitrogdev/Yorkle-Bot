import type { SequenceCharacter } from
	'../../../game/model/SequenceCharacters.js';

export const SEQUENCE_EMOJIS: Record<SequenceCharacter, string> = {
	O: '🟩',
	'-': '🟨',
	X: '🟥',
	'': '⬛'
} as const;

export type SequenceEmoji = typeof SEQUENCE_EMOJIS[
	keyof typeof SEQUENCE_EMOJIS
];