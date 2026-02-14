import { AttachmentBuilder, type BaseMessageOptions } from 'discord.js';
import path from 'node:path';

import { COVERS_PATH } from '../../../config/paths.js';
import type Song from '../../../game/entities/Song.js';

/**
 * Utility class used to build {@link Song} objects as Discord embeds.
 *
 * @author gitrog
 */
export default class SongEmbedBuilder {
	/**
	 * Builds a representation of a {@link Song} object as Discord
	 * {@link BaseMessageOptions} to embed the song's metadata into a Discord
	 * message.
	 *
	 * @author gitrog
	 *
	 * @param {Song} song the song to embed
	 *
	 * @returns message options containing the song's embedded details, as well
	 * as an attachment containing the song's thumbnail
	 */
	public build(song: Song): BaseMessageOptions {
		return {
			embeds: [{
				author: {
					name: song.artist
				},
				title: song.title,
				description: song.album,
				thumbnail: {
					url: `attachment://${song.thumbnail}`
				}
			}],
			files: [new AttachmentBuilder(path.join(
				COVERS_PATH,
				song.thumbnail
			))]
		}
	}
}