module.exports = {
	"env": {
		"node": true,
		"commonjs": true,
		"es2021": true,
		"jest": true,
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"rules": {
		"no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		]
	}
}
