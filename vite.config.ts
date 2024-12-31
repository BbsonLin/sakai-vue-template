import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path'

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    return {
        plugins: [
            vue(),
            Components({
                resolvers: [
                    PrimeVueResolver()
                ]
            }),
        ],
        // base: command === 'serve' ? '' : '/sakai-vue/',
        resolve: {
            alias: {
              '@': fileURLToPath(new URL('./src', import.meta.url)),
              '#': resolve('types')
            }
        },
        esbuild: { drop: mode !== 'development' ? ['console', 'debugger'] : [] }
    };
});
