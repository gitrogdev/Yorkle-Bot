import type Session from '../entities/Session.js';
import type { OpenSessionResult } from './OpenSessionResult.js';

export default interface OpenSessionResponse {
	result: OpenSessionResult,
	session?: Session
}