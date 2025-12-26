/**
 * Shuffles all values in a given array.
 *
 * @param {Array} array the reference to the array to shuffle
 */
module.exports = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}