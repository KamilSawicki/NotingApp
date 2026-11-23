import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from 'eslint-config-prettier/flat';

export default defineConfig([
    {
        name: 'app/files-to-lint',
        files: ['**/*.{vue,js}'],
    },

    globalIgnores(['public/**', 'vendor/**', 'var/**']),

    {
        name: 'app/browser',
        files: ['assets/**'],
        languageOptions: {
            globals: globals.browser,
        },
    },

    {
        name: 'app/node',
        files: ['*.js'],
        languageOptions: {
            globals: globals.node,
        },
    },

    js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],

    {
        name: 'app/translations',
        files: ['assets/**/*.vue'],
        rules: {
            // UI texts come from Symfony translations (translations/*.yaml) through $t().
            'vue/no-bare-strings-in-template': [
                'error',
                {
                    // The rule's default punctuation, the icon characters used as buttons and the product name.
                    allowlist: [
                        ...'( ) , . & + - = * / # % ! ? : [ ] { } < > · • ‐ – — − | × ← →'.split(' '),
                        'N',
                        'NotingApp',
                    ],
                },
            ],
        },
    },

    skipFormatting,
]);
