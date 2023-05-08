/*
  This script auto generate file `sw-env.js`,
  This file will be imported by `service-worker.js` in `/public` to read all env variables.
  Usage: All settings about FIREBASE only need configuration in `.env`
*/
require('dotenv').config(); // make sure you have '.env' file in pwd
const fs = require('fs');
const conf = process.env
fs.writeFileSync('./public/sw-env.js',
  `
const process = {
  env: {
    VUE_APP_FIREBASE_API_KEY: "${String(conf.VUE_APP_FIREBASE_API_KEY)}",
    VUE_APP_FIREBASE_AUTH_DOMAIN: "${String(conf.VUE_APP_FIREBASE_AUTH_DOMAIN)}",
    VUE_APP_FIREBASE_DATABASE_URL: "${String(conf.VUE_APP_FIREBASE_DATABASE_URL)}",
    VUE_APP_FIREBASE_PROJECT_ID: "${String(conf.VUE_APP_FIREBASE_PROJECT_ID)}",
    VUE_APP_FIREBASE_STORAGE_BUCKET: "${String(conf.VUE_APP_FIREBASE_STORAGE_BUCKET)}",
    VUE_APP_FIREBASE_MESSAGING_SENDER_ID: "${String(conf.VUE_APP_FIREBASE_MESSAGING_SENDER_ID)}",
    VUE_APP_FIREBASE_APP_ID: "${String(conf.VUE_APP_FIREBASE_APP_ID)}",
    VUE_APP_FIREBASE_MEASUREMENT_ID: "${String(conf.VUE_APP_FIREBASE_MEASUREMENT_ID)}"
  }
}
  `
);

console.log('Write ENV for public folder success')