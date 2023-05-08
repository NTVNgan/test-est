import _ from 'lodash';
import getContactInfo from './contactInfo';
import getCurrScript from './script';

declare global {
  interface Window {
    LINEBASE_GUEST_ID?: string,
    LINEBASE_ORG_ID?: string,
    LINEBASE_WORKSPACE_ID?: string,
    $linebase?: any,
  }
}

(function () {
  const currentScript = document.currentScript as HTMLScriptElement;
  const script: any = getCurrScript(currentScript);
  console.log('hello')
  console.clear()
  console.log({ script })
  console.log('Check window.linebase 1: ', `ORGID: ${window.LINEBASE_ORG_ID}`, `WORKSPACEID: ${window.LINEBASE_WORKSPACE_ID}`);
  if (script.is_demo === 'true') {
    window.LINEBASE_ORG_ID = script.org_id || '';
    window.LINEBASE_WORKSPACE_ID = script.workspace_id || '';
    console.log('Check window.linebase 2: ', `ORGID: ${window.LINEBASE_ORG_ID}`, `WORKSPACEID: ${window.LINEBASE_WORKSPACE_ID}`);
  }

  /*
    First, check allow Bots via bot/crawler detector,
    if the client request is not a bot, start to get customer info and install tracking + display widget
    by attaching Tracking Script and Widget Script tag into head
  */
  // import {Crawler, middleware} from 'es6-crawler-detect'

  try {
    console.log('CLIENT variants', window.$linebase);
    /** Set variables scss */
    document.documentElement.style.setProperty('--linebase-resource-url', `url(${script.origin_domain}/emoji.png)`);
    const installSocketClient = () => {
      return new Promise(function (resolve, reject) {
        const scriptSocket = document.createElement('script');
        scriptSocket.setAttribute('async', '');
        scriptSocket.type = 'text/javascript';
        scriptSocket.type = 'module';
        scriptSocket.src = `${script.origin_domain}/socket.js`;
        document.body.append(scriptSocket)
        scriptSocket.onload = () => {
          resolve(true);
        }
      });
    }

    const installTracking = () => {
      /** Tracking Script: Add Tracking Script to tracking all behaviours in store */
      const scriptWidget = document.createElement('script');
      scriptWidget.setAttribute('async', '');
      scriptWidget.type = 'text/javascript';
      scriptWidget.type = 'module';
      scriptWidget.src = `${script.origin_domain}/tracking.js`;
      const widgetScript = document.body.append(scriptWidget);
      console.log(':: INSTALLED TRACKING ::', widgetScript);
    }

    /** Widget Script: Add Widget Script to display widget in store */
    const installChatWidget = () => {
      // append widget element
      const widgetEl = document.createElement('div');
      widgetEl.setAttribute('id', 'linebase-widget');
      const widgetElTelePort = document.createElement('div');
      widgetElTelePort.setAttribute('id', 'select');
      const widgetElTooltip = document.createElement('div');
      widgetElTooltip.setAttribute('id', 'tooltip');
      const widgetElModal = document.createElement('div');
      widgetElModal.setAttribute('id', 'modal-widget');
      widgetEl.className = 'linebase-client-widget';
      const widgetElement = document.body.appendChild(widgetEl);
      const widgetElementPort = document.body.appendChild(widgetElTelePort);
      const widgetElementTooltip = document.body.appendChild(widgetElTooltip);
      const widgetElementModal = document.body.appendChild(widgetElModal);
      console.log(':: INSTALLED WIDGET ELEMENT ::', widgetElement);

      // append widget element
      const scriptWidget = document.createElement('script');
      scriptWidget.setAttribute('async', '');
      scriptWidget.type = 'text/javascript';
      scriptWidget.type = 'module';
      scriptWidget.src = `${script.origin_domain}/bundle-widget.js`;
      const widgetModule = document.body.append(scriptWidget);
      console.log(':: INSTALLED WIDGET MODULE ::', widgetModule);
    }

    /** Install in order to make sure the widget work correctly */
    const install = () => {
      console.log(':: INSTALL ::');
      installSocketClient().then(success => { // install socket first
        console.log(':: INSTALLED SOCKET ::');
        installTracking(); // install tracking script
        installChatWidget(); // install chat widget
      });
    };

    // create a new Crawler instance
    // const CrawlerDetector = new Crawler();
    // const userAgentString = navigator.userAgent;
    // check the current visitor's useragent
    // if (CrawlerDetector.isCrawler(userAgentString)) {
    //   // true if crawler user agent detected
    //   // Output the name of the bot that matched (if any)
    //   console.debug('Bot detected', CrawlerDetector.getMatches());
    // } else {
    /** START TO SETUP SCRIPT APP */
    getContactInfo().then(contact => {
      if (contact) {
        install()
      }
    }).catch(err => {
      console.log('getContactInfo', err);
    });
    // }
  } catch (e) {
    console.log('Error in bundle', e);
  }
})();