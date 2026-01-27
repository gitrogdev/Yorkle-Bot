import aliases from '../config/aliases.json' with { type: 'json' };

export default class AliasRegistry {
	private static aliases: Set<string>;

	public static loadAliases() {
		if (AliasRegistry.aliases != null) throw new Error(
			'AliasRegistry already loaded!'
		);
		AliasRegistry.aliases = new Set<string>();

		for (const songAliases of Object.values(aliases))
			for (const alias of songAliases) AliasRegistry.aliases.add(alias);

		console.log(AliasRegistry.aliases);
	}
}