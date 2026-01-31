import type { GuessResult } from './GuessResult.js';

export const SEQUENCE_CHARACTERS: Record<GuessResult, string> = {
	CORRECT: 'O',
	SKIP: '-',
	INCORRECT: 'X',
	NOGUESSES: 'X',
	INVALID: '',
	REPEAT: ''
} as const;