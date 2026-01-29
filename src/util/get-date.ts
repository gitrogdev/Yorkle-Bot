/**
 * Gets a date relative to today's current date.
 *
 * @param {number} mod the number of days to add to today's date (default 0)
 *
 * @returns {string} the relative date in YYYY-MM-DD format
 */
export default function getDate(mod: number = 0): string {
	return new Date(
		new Date().setDate(new Date().getDate() + mod)
	).toISOString().split('T')[0];
}