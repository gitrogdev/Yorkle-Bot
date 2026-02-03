import type DailyResults from '../model/DailyResults.js';

export default interface BroadcastPort {
	sendDailyResults(results: DailyResults): Promise<void>;
}