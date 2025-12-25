const fs = require('node:fs');
const path = require('node:path');

/**
 * Updates the data stored in a JSON file.
 * @param {String} jsonPath the path to the JSON file to update
 * @param {Object} value the JS object to write to the JSON file
 */
module.exports = function(jsonPath, value) {
	jsonPath = path.join(__dirname, jsonPath);
	fs.writeFileSync(jsonPath, JSON.stringify(value));
};