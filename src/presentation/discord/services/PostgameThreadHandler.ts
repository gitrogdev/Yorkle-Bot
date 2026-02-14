import {
	ChannelType,
	ThreadAutoArchiveDuration,
	type Client,
	type TextChannel
} from 'discord.js';

import type Guild from '../../../game/entities/Guild.js';
import type UserIdentity from '../../../game/model/UserIdentity.js';
import type PostgameDiscussionPort from
	'../../../game/ports/PostgameDiscussionPort.js';
import type Messenger from './Messenger.js';
import type ThreadCache from '../models/ThreadCache.js';
import { localize } from '../../localization/i18n.js';
import pluralize from '../../../util/pluralize.js';
import SongEmbedBuilder from '../builders/SongEmbedBuilder.js';
import type Game from '../../../game/entities/Game.js';

/**
 * Implementation of the post-game discussion port on the client to open and
 * manage post-game discussion private Discord threads.
 *
 * @author gitrog
 */
export default class PostgameThreadHandler implements PostgameDiscussionPort {
	private cache: ThreadCache = {};
	private songEmbedder: SongEmbedBuilder = new SongEmbedBuilder();

	/**
	 * Creates a new port to handle thread interactions from the game layer.
	 *
	 * @author gitrog
	 *
	 * @param {Client} client the Discord client to use for interacting with the
	 * threads
	 * @param {Messenger} messenger the messenger service to use to send
	 * messages to Discord
	 */
	constructor(private client: Client, private messenger: Messenger) {}

	/**
	 * Adds a user to all the post-game discussion threads in all the guilds
	 * that they are a part of.
	 *
	 * @author gitrog
	 *
	 * @param {UserIdentity} user a representation of the user's data
	 * @param {number | string} day the number of the day of the game's
	 * iteration
	 */
	public async joinPostgameThreads(user: UserIdentity, day: number | string) {
		if (typeof day === 'number') day = day.toString();

		if (!Object.hasOwn(this.cache, day)) {
			console.warn(
				`Failed to add ${user.name} to post-game threads for day ${day}`
				+ `: No threads loaded for day ${day}!`
			);
			return;
		}

		for (const [ guildId, threadId ] of Object.entries(this.cache[day])) {
			let discordGuild;
			try {
				discordGuild = await this.client.guilds.fetch(guildId);
			} catch (error) {
				console.warn(
					`Failed to fetch guild with ID ${guildId}:`, error
				);
				continue;
			}

			try {
				await discordGuild.members.fetch(user.id)
			} catch { continue; }

			const thread = await this.client.channels.fetch(threadId);

			if (!thread?.isThread()) {
				console.error(
					`Failed to add ${user.name} to Yorkle #${day} post-game `
					+ `discussion thread in ${discordGuild.name}: No thread `
					+ `found with ID ${threadId}!`
				);
				continue;
			}

			await thread.members.add(user.id).then(
				() => console.log(
					`Successfully added ${user.name} to Yorkle #${day} `
					+ `post-game discussion thread ${threadId} in guild `
					+ `${guildId}.`
				)
			);
		}
	}

	/**
	 * Opens a new thread for post-game discussion in a given guild.
	 *
	 * @author gitrog
	 *
	 * @param {Guild} guild the guild object passed from the game representing
	 * the Discord guild to create the thread in
	 * @param {Game} game the game the post-game discussion is regarding
	 */
	public async openPostgameThread(guild: Guild, game: Game) {
		if (!guild.channelId) {
			console.warn(
				`Failed to open post-game thread for guild with ID ${guild.id}`
				+ ': Game channel not set!'
			);
			return;
		}

		if (!Object.hasOwn(this.cache, game.day)) this.cache[game.day] = {};
		else if (
			Object.hasOwn(this.cache, game.day)
			&& Object.hasOwn(this.cache[game.day], guild.id)
		) {
			console.warn(
				`Failed to open post-game thread for guild with ID ${guild.id}`
				+ ': Thread already open!'
			);
			return;
		}

		let discordGuild;
		try {
			discordGuild = await this.client.guilds.fetch(guild.id);
		} catch (error) {
			console.warn(
				`Failed to fetch guild with ID ${guild.id}:`, error
			);
			return;
		}

		let channel: TextChannel | undefined;
		let noChannelReason = 'Channel not found!';
		try {
			channel = await discordGuild.channels.fetch(
				guild.channelId
			) as TextChannel;
			if (!channel.isTextBased()) throw new Error(
				`Channel with ID ${guild.channelId} is not text-based!`
			);
		} catch (error) {
			noChannelReason = String(error);
		}

		if (!channel) {
			console.warn(
				`Failed to fetch game channel with ID ${guild.channelId} for `
				+ `guild with ID ${guild.id}:`, noChannelReason
			);
			return;
		}

		try {
			const thread = await channel.threads.create({
				name: localize(
					'threads.postgame.name',
					discordGuild.preferredLocale,
					{
						bot: this.client.user?.username ?? 'Yorkle',
						day: game.day
					}
				),
				autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
				type: ChannelType.PrivateThread,
				reason: localize(
					'threads.postgame.reason',
					discordGuild.preferredLocale
				)
			});

			thread.send(this.songEmbedder.build(game.song));

			this.cache[game.day][guild.id] = thread.id;
			guild.threads[game.day] = thread.id;

			console.log(
				`Successfully opened post-game discussion thread ${thread.id} `
				+ `in guild ${guild.id} for Yorkle #${game.day}.`
			);
		} catch (error) {
			console.warn(
				`Failed to open thread in channel ${guild.channelId} in guild `
				+ `${guild.id}:`, error
			);
		}
	}

	/**
	 * Populates the cache with all threads for the guild.
	 *
	 * @author gitrog
	 *
	 * @param {Guild} guild the guild to get the threads from
	 */
	public async restorePostgameThreads(guild: Guild) {
		let restored = 0;
		for (const [ day, threadId ] of Object.entries(guild.threads)) {
			this.cache[day] = this.cache[day] ?? {};
			this.cache[day][guild.id] = threadId;
			restored++;
		}
		console.log(
			'Successfully restored '
			+ `${pluralize('post-game discussion thread', restored)} for guild `
			+ `${guild.id}.`
		)
	}
}