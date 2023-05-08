import { createApp } from 'vue';
import App from './layouts/App.vue';
import './registerServiceWorker';
import { router } from './router';
import { store } from './store';
import i18n from './i18n';
import registerGlobalDirectives from './plugins/global-directives';
import registerGlobalFilters from './plugins/global-filters';
import mitt from 'mitt';
import 'tailwindcss/base.css';
import 'tailwindcss/components.css';
import 'tailwindcss/utilities.css';
import './assets/styles/main.scss';

const emitter = mitt();

const app = createApp(App);

app.provide('emitter', emitter)

registerGlobalDirectives(app);

registerGlobalFilters(app)

app.use(store)
    .use(router)
    .use(i18n)
    .mount('#app');
