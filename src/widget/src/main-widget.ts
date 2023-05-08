/* Install chat widget */
import { createApp } from 'vue';
import App from './widget/App.vue'
import './assets/styles/main.scss';
import registerGlobalDirectives from '../../plugins/global-directives.js';
import mitt from 'mitt';

/** Fetch store detail before render widget **/
(function () {
  const app = createApp(App);
  registerGlobalDirectives(app);
  const emitter = mitt();
  app.provide('emitter', emitter);
  console.log({ window });
  if (window.$linebase.io) {
    console.log(':: LOAD CW > SOCKET IO ::');
    app.provide('socket', window.$linebase.io)
    app.provide('contact', window.$linebase.contact)
  }
  const startWidget = () => {
    console.log(':: LOAD CW > ID ::');
    app.mount('#linebase-widget');
  }

  startWidget();
})();
