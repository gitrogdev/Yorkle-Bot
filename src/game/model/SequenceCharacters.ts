import type { GuessResult } from './GuessResult.js';
import type { SkipResult } from './SkipResult.js';

export const SEQUENCE_CHARACTERS: Record<GuessResult | SkipResult, string> = {
	CORRECT: 'O',
	SKIP: '-',
	INCORRECT: 'X',
	NOGUESSES: 'X',
	INVALID: '',
	REPEAT: '',
	LAST: ''
} as const;