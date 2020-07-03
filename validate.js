const Ajv = require('ajv');
const ajv = new Ajv();

ajv.addFormat('size', {
	type: 'string',
	validate: /^[0-9.]+(px|mm|cm|in)$/
});

ajv.addFormat('pages', {
	type: 'string',
	validate(str) {
		return str.split(',').every((part) => /^\d+(-\d+)?$/.test(part.trim()));
	}
});

module.exports = ajv.compile({
	type: 'object',
	required: [
		'body'
	],
	properties: {
		header: {
			type: 'string'
		},
		footer: {
			type: 'string'
		},
		body: {
			type: 'string'
		},
		format: {
			type: 'string',
			enum: [
				'letter',
				'legal',
				'tablid',
				'ledger',
				'a0',
				'a1',
				'a2',
				'a3',
				'a4',
				'a5',
				'a6',
			]
		},
		landscape: {
			type: 'boolean'
		},
		width: {
			type: 'string',
			format: 'size'
		},
		height: {
			type: 'string',
			format: 'size'
		},
		left: {
			type: 'string',
			format: 'size'
		},
		right: {
			type: 'string',
			format: 'size'
		},
		top: {
			type: 'string',
			format: 'size'
		},
		bottom: {
			type: 'string',
			format: 'size'
		},
		scale: {
			type: 'number',
			minimum: .1,
			maximum: 2
		},
		background: {
			type: 'boolean'
		},
		pages: {
			type: 'string',
			format: 'pages'
		},
		cssPage: {
			type: 'boolean'
		},
		media: {
			type: 'string',
			enum: [
				'screen',
				'print'
			]
		},
		timeout: {
			type: 'number',
			minimum: 1
		},
		wait: {
			type: 'string',
			enum: [
				'load',
				'net0',
				'net2'
			]
		}
	}
});
