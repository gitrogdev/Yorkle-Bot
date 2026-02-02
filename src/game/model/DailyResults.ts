import type GameResults from '../../persistence/dto/GameResults.js';
import type Guild from '../entities/Guild.js';

export default interface DailyResults {
	results: GameResults,
	max: number,
	guilds: Guild[]
}