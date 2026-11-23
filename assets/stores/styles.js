import { ref } from 'vue';
import { defineStore } from 'pinia';

const SAMPLE_APP_CSS = `.note { font-family: 'IBM Plex Serif', Georgia, serif; font-size: 16px; line-height: 1.7; color: #2b2722; }
h1 { font-family: 'IBM Plex Sans', sans-serif; font-size: 30px; line-height: 1.2; margin: 0 0 16px; }
h2 { font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; margin: 28px 0 8px; }
p { margin: 0 0 14px; }
code { font-family: 'IBM Plex Mono', monospace; font-size: 0.86em; background: #f1ece2; padding: 1px 5px; border-radius: 3px; }
pre { background: #f1ece2; padding: 12px 14px; border-radius: 6px; overflow: auto; }
blockquote { margin: 0 0 14px; padding-left: 14px; border-left: 3px solid #ddd5c6; color: #6b6357; }
a { color: #2f6b4a; }
ul, ol { margin: 0 0 14px; padding-left: 22px; }
li { margin: 2px 0; }
table { width: 100%; margin: 0 0 14px; border-collapse: collapse; font-size: 0.94em; }
th, td { padding: 6px 10px; border: 1px solid #ddd5c6; text-align: left; vertical-align: top; }
th { font-family: 'IBM Plex Sans', sans-serif; font-weight: 600; background: #f1ece2; }
tbody tr:nth-child(even) td { background: #faf7f1; }`;

const SAMPLE_USER_CSS = `.note { font-size: 15.5px; }
h1 { color: #2f6b4a; }
h2 { text-transform: uppercase; letter-spacing: 0.06em; font-size: 13px; color: #6b6357; }`;

export const useStylesStore = defineStore('styles', () => {
    const appCss = ref(SAMPLE_APP_CSS);
    const userCss = ref(SAMPLE_USER_CSS);

    function updateUserCss(css) {
        userCss.value = css;
    }

    return { appCss, userCss, updateUserCss };
});
