/**
 * Converts a string into its hexadecimal representation.
 *
 * @param {String} str the string to convert into hexadecimal representation
 * @returns the hexadecimal representation of the string
 */
module.exports.hexify = function(str) {
	let hexed = '';
	for (const c of str) hexed += c.charCodeAt().toString(16).padStart(4, 0);
	return hexed;
};

/**
 * Converts a hexadecimal representation of a string into a standard string
 *
 * @param {String} hex the hexadecimal representation of the string
 * @returns the standard string decoded from hexadecimal
 */
module.exports.dehexify = function(hex) {
	let dehexed = '';
	for (let i = 0; i < hex.length; i += 4) dehexed += String.fromCharCode(
		parseInt(hex.substring(i, i + 4), 16)
	);
	return dehexed;
};