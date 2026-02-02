import type { Client } from 'discord.js';

import type DailyResults from '../../../game/model/DailyResults.js';
import { SEQUENCE_CHARACTERS } from '../../../game/model/SequenceCharacters.js';
import { RESULTS_EMOJIS } from '../models/ResultsEmojis.js';
import type ResultsBroadcastOptions from '../models/ResultsBroadcastOptions.js';

export default class GameResultsBuilder {
	/**
	 * Creates a new message builder to build messages to send results to
	 * guilds.
	 *
	 * @param {Client} client the Discord client to use to fetch guild members
	 */
	constructor(private client: Client) {}

	/**
	 * Builds an array of game results broadcast options to send daily results
	 * to all participating guilds.
	 *
	 * @param {DailyResults} results the daily results for yesterday's game
	 *
	 * @returns {Promise<ResultsBroadcastOptions[]>} a promise of
	 * an array containing game results broadcast options for each guild
	 */
	public async build(
		results: DailyResults
	): Promise<ResultsBroadcastOptions[]> {
		const messages: ResultsBroadcastOptions[] = [];

		for (const guild of results.guilds) {
			if (!guild.channelId) {
				console.warn(
					'Failed to build result broadcast options for guild with '
					+ `ID ${guild.id}: No channel ID defined!`
				);
				continue;
			}

			let played = 0;
			let scoreSum = 0;

			const guildSequences: Record<string | number, string[]> = {};
			for (let j = 1; j <= results.max; j++) guildSequences[j] = [];
			guildSequences[SEQUENCE_CHARACTERS.INCORRECT] = [];

			let discordGuild;
			try {
				discordGuild = await this.client.guilds.fetch(guild.id);
			} catch (error) {
				console.warn(
					`Failed to fetch guild with ID ${guild.id}: `, error
				);
				continue;
			}
			for (const memberId of [...guild.members]) {
				try {
					await discordGuild.members.fetch(memberId);
				} catch (error) {
					console.log(
						`Failed to fetch member with ID ${memberId} in guild `
						+ `${guild.id}: `, error
					);
					guild.members.delete(memberId);
					continue;
				}

				if (Object.hasOwn(results.results, memberId)) {
					played++;
					const sequence = results.results[memberId].sequence;
					let guesses: string | number = sequence.length;
					if (
						guesses === results.max && sequence.charAt(
							results.max - 1
						) !== SEQUENCE_CHARACTERS.CORRECT
					) guesses = SEQUENCE_CHARACTERS.INCORRECT;
					scoreSum += guesses === SEQUENCE_CHARACTERS.INCORRECT ?
						results.max + 1 : guesses as number;
					guildSequences[guesses].push(memberId);
				}
			}

			if (played === 0) guild.streak = 0;
			else {
				guild.streak++;

				let formattedResults = `\n${RESULTS_EMOJIS.BEST} `;
				let firstLine = true;
				for (const count in guildSequences) {
					const members = guildSequences[count];
					if (members.length === 0) continue;
					if (!firstLine) formattedResults += '\n';
					else if (
						firstLine && count === SEQUENCE_CHARACTERS.INCORRECT
					) formattedResults = '\n';
					else firstLine = false;
					formattedResults += `${count}/${results.max}:`;
					for (const memberId of members)
						formattedResults += ` <@${memberId}>`;
				}

				const averageScore = Math.round(
					(scoreSum / played) * 100
				) / 100;

				messages.push({
					channel: guild.channelId,
					locale: discordGuild.preferredLocale,
					i18nParams: {
						streak: guild.streak,
						streakEmojis: RESULTS_EMOJIS.STREAK.repeat(
							Math.ceil(guild.streak / 30)
						),
						results: formattedResults,
						avg: averageScore.toFixed(2),
						loss: results.max + 1
					}
				});
			}
		}

		return messages;
	}
}