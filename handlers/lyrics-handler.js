const fs = require('node:fs');
const path = require('node:path');

let lyrics = new Set();

const lines = fs.readFileSync(
	path.join(__dirname, '../media/lyrics.txt'),
	'utf-8'
).split(/\r?\n/);

for (let line of lines) {
	line = line.trim();
	if (lyrics.has(line) || line === '') continue;
	lyrics.add(line);
}
lyrics = Array.from(lyrics);
console.log(
	`Loaded ${lyrics.length} unique lyric${lyrics.length === 1 ? '' : 's'}.`
);

module.exports = lyrics;