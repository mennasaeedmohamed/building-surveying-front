module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{ico,png,json,txt}'
	],
	swDest: 'build/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};