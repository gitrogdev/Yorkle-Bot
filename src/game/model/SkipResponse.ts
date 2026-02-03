import type { SkipResult } from './SkipResult.js';

export default interface SkipResponse {
	result: SkipResult,
	clip: number
}