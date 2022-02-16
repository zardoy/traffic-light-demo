import vuePlugin from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// usually @zardoy/vit is being used intead
export default defineConfig({
    base: './',
    plugins: [vuePlugin()],
})
