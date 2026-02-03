import { SEQUENCE_EMOJIS } from '../models/SequenceEmojis.js';

export default class SequencePresenter {
	/**
	 * Builds a sequence for display from an internally formatted sequence
	 * string.
	 *
	 * @param {string} sequence the sequence string for the guess results
	 *
	 * @returns {string} a formatted version of the sequence string for display
	 * to users
	 */
	public build(sequence: string): string {
		const chars = Array.from(sequence);
		const result = Array.from({ length: 6 }, (_, i) => chars[i] ?? '');

		let display = '';
		for (const char of result) display += SEQUENCE_EMOJIS[char];
		return display;
	}
}