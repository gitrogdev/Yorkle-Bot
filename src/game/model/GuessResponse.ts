import type Song from '../entities/Song.js';
import type { GuessResult } from './GuessResult.js';

export default interface GuessResponse {
	day: number,
	result: GuessResult,
	guesses: number,
	song?: Song
}