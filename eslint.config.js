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
            'vue/no-bare-strings-in-template': [
                'error',
                {
                    allowlist: [
                        ...'( ) , . & + - = * / # % ! ? : [ ] { } < > · • ‐ – — − | × ← → ✎ ▾'.split(' '),
                        'AI',
                        'N',
                        'NotingApp',
                    ],
                },
            ],
        },
    },

    skipFormatting,
]);
