# Yorkle
**Yorkle** is a Discord bot that hosts a daily music puzzle game functioning similar to games such as *Wordle*. Built for a small Radiohead fan community, the bot presents all players with the same randomly selected audio clip from a Radiohead song each day. Players must identify the song in as few guesses as possible.

# Requirements
* Node.js
* FFmpeg

# Configuration & Setup
> Note: For copyright reasons, all .mp3 files and album artwork are excluded from this repository via .gitignore. To host your own instance of Yorkle, you must provide your own media files.

## Environment Variables 
Create a `.env` file in the project root with the following variables:
```
APPLICATION_ID=your_discord_application_id
DISCORD_TOKEN=your_discord_bot_token
```

## Configuration Files
All configuration files are located in the `/config/` directory:

* `albums.json`
Maps album names (as defined in the .mp3 metadata) to album cover filenames (excluding the .jpg extension).
* `aliases.json`
Maps song filenames (excluding the .mp3 extension) to an array of acceptable answers.
All answers should:
	* be lowercase
	* contain no spaces
	* exclude punctuation `. , - ( ) ' / ? !`
* `guesslengths.json`
An array of increasing numeric values that define the length (in seconds) of each audio clip per guess.
	* The number of guesses available to players is determined by the length of this array.
* `statuses.json`
An array of strings from which the bot randomly selects a Discord status every five minutes.

## Directory Structure
You must provide the following directories and files:
`/data/`
Stores all runtime-generated data:
* shuffled song queue
* generated audio clips for each puzzle
* daily puzzle data, including scores

Must include:
* `/data/days/`
* `/data/guilds/`

`/media/`
* Album artwork (.jpg)
* `lyrics.txt` - used by the `/lyric` command
> This command is non-essential and can safely be removed by deleting `/commands/lyrics.js`

`/songs`
* All .mp3 files used by the bot
* Each file must include metadata for artist, title, and album.

## Customization
Although Yorkle was built for Radiohead, it can easily be adapted for any artist by replacing the media files and updating the configuration files accordingly.

# Deployment
Once the bot is properly configured, complete the following steps to deploy and run Yorkle.
## 1. Shuffle the Song Queue
All songs must be added to and randomized within the daily puzzle queue:
```bash
npm run shuffle
```
If you add any new songs, run this command again to incorporate them into the existing queue and reshuffle any unplayed tracks.
> This step requires a bot restart.

## 2. Deploy Commands to Discord
Register the bot's slash commands with Discord:
```bash
npm run deploy-commands
```
Run this command whenever a command is added or removed. Existing command files may be modified without requiring redeployment.
> This step requires a bot restart.

## 3. Start the Bot
Once the queue is shuffled and commands are deployed, start the bot:
```bash
npm run start
```