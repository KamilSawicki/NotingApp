import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
    plugins: [vue(), symfonyPlugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./assets', import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            input: {
                app: './assets/main.js',
            },
        },
    },
    server: {
        // Vite runs in a container; the browser reaches it through the published port.
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        origin: process.env.VITE_ORIGIN ?? 'http://localhost:5173',
    },
});
