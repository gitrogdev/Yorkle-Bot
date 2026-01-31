export const GuessResult = {
	Correct: 'CORRECT',
	Incorrect: 'INCORRECT',
	OutOfGuesses: 'NOGUESSES',
	Repeat: 'REPEAT',
	Invalid: 'INVALID',
	Skip: 'SKIP'

} as const;

export type GuessResult = typeof GuessResult[keyof typeof GuessResult];