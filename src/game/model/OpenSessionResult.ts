export const OpenSessionResult = {
	Open: 'OPEN',
	Collision: 'COLLISION',
	Played: 'PLAYED'

} as const;

export type OpenSessionResult = typeof OpenSessionResult[
	keyof typeof OpenSessionResult
];