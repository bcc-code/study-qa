import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'

import dotenv from 'dotenv'

dotenv.config()


export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: [path.resolve(__dirname, './src/lang/**')],
    }),
  ],
  base: '/study-qa/' + process.env.FOLDER + "/",
  appType: 'mpa',
})