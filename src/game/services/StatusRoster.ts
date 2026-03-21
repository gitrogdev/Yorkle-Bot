import type StatusDataStore from
	'../../persistence/datastores/StatusDataStore.js';

/**
 * Game-layer collection of Discord presence statuses.
 *
 * @author gitrog
 */
export default class StatusRoster {
	/** An array containing the Discord presence statuses as strings. */
	private statuses: string[];

	/**
	 * Creates a new collection of Discord presence statuses by loading them
	 * from file.
	 *
	 * @author gitrog
	 *
	 * @param {StatusDataStore} store the status data store to get the statuses
	 * from
	 */
	constructor(private store: StatusDataStore) {
		this.statuses = store.load();
	}

	/**
	 * Gets an array containing the Discord presence statuses as strings.
	 *
	 * @author gitrog
	 *
	 * @returns {string[]} an array containing the Discord presence statuses as
	 * strings, by value
	 */
	public getStatuses(): string[] {
		return [...this.statuses];
	}
}