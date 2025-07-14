import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import myPlugins from "./plugins/myPlugins";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), myPlugins()],
})
