/**
 * Converts a string into its hexadecimal representation.
 *
 * @param {string} str the string to convert into hexadecimal representation
 *
 * @returns {string} the hexadecimal representation of the string
 */
export function hexify(str: string): string {
	let hexed = '';
	for (const c of str) hexed += c.charCodeAt(0).toString(16).padStart(4, '0');
	return hexed;
};

/**
 * Converts a hexadecimal representation of a string into a standard string.
 *
 * @param {string} hex the hexadecimal representation of the string
 *
 * @returns {string} the standard string decoded from hexadecimal
 */
export function dehexify(hex: string): string {
	let dehexed = '';
	for (let i = 0; i < hex.length; i += 4) dehexed += String.fromCharCode(
		parseInt(hex.substring(i, i + 4), 16)
	);
	return dehexed;
};