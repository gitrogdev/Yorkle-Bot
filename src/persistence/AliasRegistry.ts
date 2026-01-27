import aliases from '../config/aliases.json' with { type: 'json' };
import cleanTitle from '../util/clean-song.js';

export default class AliasRegistry {
	private static aliases: Set<string>;

	public static loadAliases() {
		if (AliasRegistry.aliases != null) throw new Error(
			'AliasRegistry already loaded!'
		);
		AliasRegistry.aliases = new Set<string>();

		for (const songAliases of Object.values(aliases))
			for (const alias of songAliases) {
				const cleanAlias = cleanTitle(alias);
				if (cleanAlias !== alias) console.warn(
					`The alias "${alias}" is not clean in in aliases.json!`
				);
				if (AliasRegistry.aliases.has(cleanAlias)) console.warn(
					`Multiple instances of the alias "${cleanAlias}" appear in `
					+ 'aliases.json!'
				); else AliasRegistry.aliases.add(cleanAlias);
			}
	}
}