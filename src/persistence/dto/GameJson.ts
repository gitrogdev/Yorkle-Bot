import type GameResults from './GameResults.js';

export default interface GameJson {
	day: number,
	song: string,
	timestamp: number,
	players: GameResults
}