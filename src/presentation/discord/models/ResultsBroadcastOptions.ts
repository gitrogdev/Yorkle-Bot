export default interface ResultsBroadcastOptions {
	channel: string,
	i18nParams: {
		streak: number,
		streakEmojis: string,
		results: string,
		avg: string,
		loss: number
	}
}