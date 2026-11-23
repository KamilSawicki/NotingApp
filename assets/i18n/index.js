import { IntlMessageFormat } from 'intl-messageformat';

const locale = document.documentElement.lang;
const catalogue = JSON.parse(document.getElementById('translations')?.textContent ?? '{}');
const formatters = new Map();

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

export function formatDateTime(isoDate) {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(isoDate));
}

export default {
    install(app) {
        app.config.globalProperties.$t = t;
    },
};
