/**
 * Pads a day number out to four digits with zeros.
 *
 * @author gitrog
 *
 * @param {number} day the day to pad with zeros
 *
 * @returns {string} the day padded to four digits with zeros (e.g. 1 -> '0001')
 */
export default function padDay(day: number): string {
	return day.toString().padStart(4, '0');
}