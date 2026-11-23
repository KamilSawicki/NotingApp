import { IntlMessageFormat } from 'intl-messageformat';

// Symfony renders the frontend translation domains into the page (templates/app.html.twig).
const locale = document.documentElement.lang;
const catalogue = JSON.parse(document.getElementById('translations')?.textContent ?? '{}');
const formatters = new Map();

/**
 * Translates a message key from a domain (like Symfony's trans()), formatting ICU placeholders with the parameters.
 * An unknown key is returned as is, so it stays visible in the UI.
 */
export function t(key, params = {}, domain = 'messages') {
    const message = catalogue[domain]?.[key];

    if (message === undefined) {
        if (import.meta.env.DEV) {
            console.warn(`Missing translation: ${domain}:${key}`);
        }

        return key;
    }

    const id = `${domain}:${key}`;

    if (!formatters.has(id)) {
        formatters.set(id, new IntlMessageFormat(message, locale));
    }

    return formatters.get(id).format(params);
}

/**
 * Vue plugin exposing t() in templates as $t().
 */
export default {
    install(app) {
        app.config.globalProperties.$t = t;
    },
};
