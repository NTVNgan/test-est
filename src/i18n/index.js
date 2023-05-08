import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import messageI18 from './i18.json';

const app = createApp();
app.use(createI18n);

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: messageI18,
});
export default i18n;
