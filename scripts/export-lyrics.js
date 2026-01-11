const fs = require('node:fs');
const path = require('node:path');

const lyrics = require('../handlers/lyrics-handler');

const content = lyrics.join('\n');

fs.writeFileSync(path.join(__dirname, '../data/used-lyrics.txt'), content);