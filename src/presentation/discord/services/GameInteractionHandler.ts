import {
	AttachmentBuilder,
	type ChatInputCommandInteraction
} from 'discord.js';

import type Yorkle from '../../../game/Yorkle.js';
import toUserIdentity from '../mappers/to-user-identity.js';
import { localePluralize, localize } from '../../localization/i18n.js';
import type Session from '../../../game/entities/Session.js';
import path from 'node:path';
import { MEDIA_ROOT } from '../../../config/paths.js';
import { SEQUENCE_EMOJIS } from '../models/SequenceEmojis.js';

export default class GameInteractionHandler {
	constructor(private game: Yorkle) {}

	/**
	 * Sends the next audio clip to the user.
	 *
	 * @param {ChatInputCommandInteraction} interaction the interaction with the
	 * user to send the clip to
	 * @param {Session} session the open session to get the clip from
	 */
	private async sendClip(
		interaction: ChatInputCommandInteraction,
		session: Session
	) {
		const clip = session.getClip();
		interaction.user.send({
			content: localize('game.presentclip', interaction.locale, {
				clip: clip.clip
			}),
			files: [ new AttachmentBuilder(clip.path) ]
		}).then(() => console.log(
			`Successfully presented clip ${clip.clip} to `
			+ `${interaction.user.username}.`
		)).catch();
	}

	/**
	 * Makes a guess and presents the response to the user.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user making the guess
	 */
	public async makeGuess(interaction: ChatInputCommandInteraction) {
		const guess = interaction.options.getString('song');
		const session = this.game.sessions.getSession(
			toUserIdentity(interaction.user)
		);

		if (!guess) {
			await interaction.editReply(localize(
				'errors.noguess', interaction.locale
			)).catch();
			return;
		};

		if (!session) {
			await interaction.editReply(localize(
				'errors.nosession', interaction.locale
			)).catch();
			return;
		}

		const response = session.guess(guess);

		if (response.result === 'CORRECT' || response.result === 'NOGUESSES') {
			if (!response.song) throw new Error(
				'Failed to present guess response to user '
				+ `${interaction.user.username}: Guess result was `
				+ `${response.result}, but no song included in response!`
			);
			await interaction.editReply({
				content: localize(
					response.result === 'CORRECT' ? 'game.correctguess' :
						'game.incorrectguess',
					interaction.locale,
					response.result === 'CORRECT' ? {
						numGuesses: localePluralize(
							interaction.locale,
							'plurals.guess',
							response.guesses
						)
					} : { guess: guess }
				) + (response.result === 'NOGUESSES' ? (
					' ' + localize('game.loss', interaction.locale) + '\n\n'
					+ localize('game.nospoilies', interaction.locale)
				) : ''),
				embeds: [{
					author: {
						name: response.song.artist
					},
					title: response.song.title,
					description: response.song.album,
					thumbnail: {
						url: `attachment://${response.song.thumbnail}`
					}
				}],
				files: [new AttachmentBuilder(path.join(
					MEDIA_ROOT, response.song.thumbnail
				))]
			}).catch();
		} else if (response.result === 'INCORRECT') await interaction.editReply(
			localize(
				'game.incorrectguess',
				interaction.locale,
				{ guess: guess }
			) + ' ' + localize('game.tryagain', interaction.locale)
		).then(() => this.sendClip(interaction, session)).catch();
		else await interaction.editReply(localize(
			`errors.${response.result.toLowerCase()}guess`,
			interaction.locale,
			{ guess: guess }
		)).catch();
	}

	/**
	 * Attempts to start a new session of the game for a user.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user starting the game
	 */
	public async newGame(interaction: ChatInputCommandInteraction) {
		const response = await this.game.sessions.open(
			toUserIdentity(interaction.user)
		);

		await interaction.editReply(localize(
			response.result === 'OPEN' ? 'game.sessionopened' :
				response.result === 'COLLISION' ? 'errors.sessioncollision' :
					'errors.playedtoday',
			interaction.locale
		)).catch();

		if (response.result === 'OPEN') this.sendClip(
			interaction, response.session!
		);
	}

	/**
	 * Attempts to share the results for today's game.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user sharing their game results
	 */
	public async shareResults(interaction: ChatInputCommandInteraction) {
		const game = await this.game.getGame();
		const response = game.getResult(interaction.user.id);

		if (response.sequence) {
			const chars = Array.from(response.sequence);
			const result = Array.from({ length: 6 }, (_, i) => chars[i] ?? '');

			let sequence = '';
			for (const char of result) sequence += SEQUENCE_EMOJIS[char];
			await interaction.editReply(localize(
				'game.results',
				interaction.locale,
				{
					day: response.day,
					sequence: sequence
				}
			)).catch();
		} else await interaction.editReply(localize(
			'errors.hasntplayed',
			interaction.locale,
			{ day: response.day }
		)).catch();
	}

	/**
	 * Attempts to skip the current clip.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user skipping the clip
	 */
	public async skipGuess(interaction: ChatInputCommandInteraction) {
		const session = this.game.sessions.getSession(
			toUserIdentity(interaction.user)
		);

		if (!session) {
			await interaction.editReply(localize(
				'errors.nosession', interaction.locale
			)).catch();
			return;
		}

		const response = session.skip();

		await interaction.editReply(localize(
			response.result === 'SKIP' ? 'game.skipped' : 'errors.lastclip',
			interaction.locale,
			{
				clip: response.clip
			}
		));
		if (response.result === 'SKIP') await this.sendClip(
			interaction, session
		);
	}
}