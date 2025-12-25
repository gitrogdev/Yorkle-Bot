/**
 * Shuffles all values in a given array.
 *
 * @param {Array} array the reference to the array to shuffle
 */
module.exports = function(array) {
	for (let i = 0; i < array.length; i++) {
		const newPos = Math.floor(Math.random() * array.length);
		[array[i], array[newPos]] = [array[newPos], array[i]];
	}
};