import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'



// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      vueDevTools({
        launchEditor: 'code'
      }),
      tailwindcss(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          'vue-i18n',
          '@vueuse/core',
          {
            'naive-ui': [
              'useDialog',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        extensions: ['vue'],
        resolvers: [NaiveUiResolver()],
        include: [/\.vue$/, /\.vue\?vue/],
      }),
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__dirname, 'locales/**')],
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
