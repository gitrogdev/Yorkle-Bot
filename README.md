# Yorkle
**Yorkle** is a Discord bot that hosts a daily music puzzle game functioning similar to games such as *Wordle*. Built for a small community of Radiohead fans, the bot presents all players with the same randomly selected audio clip from a song from Radiohead or one of Thom Yorke's other projects each day. Players must identify the song in as few guesses as possible.

> **Availability Note:**  
> While Yorkle is open source, it is not a publicly hosted bot and cannot be directly added to your Discord server. To use Yorkle, you must self-host your own instance.

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
The following optional variables can also be provided in the `.env`:
```
DATA_ROOT=path_to_data_folder
DEV_MODE=true
FFMPEG_PATH=path_to_ffmpeg.exe
MEDIA_ROOT=path_to_media_folder
SONGS_ROOT=path_to_songs_folder
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
* `judgements.txt` - used by the `/judgejuryexecutioner` command

`/songs`
* All .mp3 files used by the bot
* Each file must include metadata for artist, title, and album.

## Customization
Although Yorkle was built for Radiohead and other Thom Yorke projects, it can easily be adapted for any artist by replacing the media files and updating the configuration files accordingly.

# Deployment
Once the bot is properly configured, complete the following steps to deploy and run Yorkle.
## 1. Install Dependencies
In order to run, the Node.js dependencies must be installed:
```bash
npm install
```

## 2. Compile the TypeScript
Compile the TypeScript into JavaScript:
```bash
npm run build
```

## 3. Start the Bot
Once the dependencies are installed and the JavaScript is compiled, start the bot:
```bash
npm run start
```

## 4. Bind a Bot Channel
After inviting the bot to your Discord server, a user with the **Manage Roles** permission must run the following command to choose which channel Yorkle will use for daily recaps:
```
/setgamechannel <channel>
```
> This only needs to be done once per server.

# User Guide
This guide can be provided to users of the bot to explain its usage:
```md
# What is Yorkle?

**Yorkle** is a Thom Yorke guessing game. Functioning similarly to games like Wordle, where all players are given the same puzzle each day. Players will be given a clip of a song from Radiohead or one of Thom Yorke's other projects, and must attempt to identify it. On a correct guess, the game ends. On an incorrect guess, players will be given a longer clip of the song, and the opportunity to guess again. After six clips, if the player has not managed to guess the song correctly, the player loses.

**Since all players are playing the same puzzle, please do not discuss the  results of the puzzle without using || spoiler tags. ||**
-# Spoiler tags can be created by surrounding text with double vertical bars, `||like this||`

# How do I play?

To play Yorkle, ensure your Privacy Settings allow DMs from the Yorkle bot. Then use the `/yorkle` command to start. The bot will then begin DMing you the clips for today's puzzle, to which you can respond with the `/guess` command to guess a song, or with the `/skip` command to skip that clip and get a longer one. Once you've finished, you can share your results in this channel by using the `/share` command back here.

# Commands
`/yorkle` - Starts a new round of Yorkle.
`/guess` - Guess the song based on the clip provided. (*Only works in DMs*)
`/skip` - Skips the current clip. (*Only works in DMs*)
`/share` - Shares a **spoiler-free** recap of your game.
`/nextgame` - Returns the timestamp of the next puzzle reset.
`/contents` - Returns information about the possible contents of the game.
`/lyric` - Returns a random lyric from a song known by the bot.
`/judgement` - Seeks 8-ball style judgement from the bot, using song lyrics.

:warning::bangbang:  **IF THE BOT IS OFFLINE, RETURNS AN ERROR, OR OTHERWISE BEHAVES UNEXPECTEDLY, PLEASE REPORT THIS TO <@966923213214990366>**
```