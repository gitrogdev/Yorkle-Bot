import js from '@eslint/js';
import tselint from 'typescript-eslint';

export default tselint.config(
	js.configs.recommended,
	...tselint.configs.recommended,

	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tselint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		rules: {
			'arrow-spacing': ['warn', { before: true, after: true }],
			'brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'comma-dangle': ['error', 'never'],
			'comma-spacing': 'error',
			'comma-style': 'error',
			curly: ['warn', 'multi'],
			'dot-location': ['error', 'property'],
			'handle-callback-err': 'off',
			indent: ['error', 'tab'],
			'keyword-spacing': 'error',
			'max-len': ['warn', { code: 80 }],
			'max-nested-callbacks': ['error', { max: 4 }],
			'max-statements-per-line': ['error', { max: 2 }],
			'no-console': 'off',
			'no-empty-function': 'off',
			'@typescript-eslint/no-empty-function': 'error',
			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
			'no-floating-decimal': 'error',
			'no-inline-comments': 'error',
			'no-lonely-if': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
			'no-trailing-spaces': ['error'],
			'no-var': 'error',
			'no-undef': 'off',
			'object-curly-spacing': ['error', 'always'],
			'prefer-const': 'error',
			quotes: ['error', 'single'],
			'space-before-blocks': 'error',
			'space-before-function-paren': [
				'error',
				{ anonymous: 'never', named: 'never', asyncArrow: 'always' }
			],
			'space-in-parens': 'error',
			'space-infix-ops': 'error',
			'space-unary-ops': 'error',
			'spaced-comment': 'error',
			yoda: 'error'
		}
	}
);
