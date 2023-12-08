


import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
// Bundled locale messages, see vite.config.ts
import messages from '@intlify/unplugin-vue-i18n/messages'

const queryParams = new URLSearchParams(window.location.search);

const locale = queryParams.get('app-language') || queryParams.get('language');
console.log('locale', locale);

const i18n = createI18n({
    locale: locale || 'en',
    fallbackLocale: 'en',
    messages: messages,
})

createApp(App).use(i18n).mount('#app');
