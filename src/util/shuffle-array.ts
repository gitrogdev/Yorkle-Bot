/**
 * Shuffles all values in a given array.
 *
 * @author gitrog
 *
 * @param {T[]} array the reference to the array to shuffle
 */
export default function shuffleArray<T>(array: T[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	};
};