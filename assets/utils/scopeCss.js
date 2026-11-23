function parse(css) {
    const sheet = new CSSStyleSheet();

    try {
        sheet.replaceSync(css);
    } catch {
        return [];
    }

    return [...sheet.cssRules].filter((rule) => rule instanceof CSSStyleRule);
}

function scopeSelector(selector, scope) {
    return selector.startsWith('.note') ? `${scope} ${selector}` : `${scope} .note ${selector}`;
}

export function scopeCss(css, scope) {
    return parse(css)
        .map((rule) => {
            const selectors = rule.selectorText.split(',').map((selector) => scopeSelector(selector.trim(), scope));

            return `${selectors.join(', ')} { ${rule.style.cssText} }`;
        })
        .join('\n');
}

export function countCssRules(css) {
    return parse(css).length;
}
