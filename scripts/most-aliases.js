const aliases = require('../config/aliases.json');

let max = 0;
let max_name = 'nothing';

for (const track in aliases) {
	const trackAliases = aliases[track].length;
	if (trackAliases > max) {
		max = trackAliases;
		max_name = track;
	}
}

console.log(
	`${max_name} has the most aliases with ${max} alias${max == 1 ? '' : 'es'}`
);