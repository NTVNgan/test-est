| ENV | BUILD |
| ------ | ------ |
| FE DEV | [![build](https://github.com/YoungWorldTechnology/lb-frontend/actions/workflows/build-fe-develop.yaml/badge.svg)](https://github.com/YoungWorldTechnology/lb-frontend/actions/workflows/build-fe-develop.yaml)|
| FE STAGING | [![build](https://github.com/YoungWorldTechnology/lb-frontend/actions/workflows/build-fe-staging.yaml/badge.svg)](https://github.com/YoungWorldTechnology/lb-frontend/actions/workflows/build-fe-staging.yaml) |
| FE CW DEV | [![build](https://github.com/YoungWorldTechnology/lb-frontend/actions/workflows/build-cw-develop.yaml/badge.svg)](https://github.com/YoungWorldTechnology/lb-frontend/actions/workflows/build-cw-develop.yaml)|
| FE CW STAGING | [![build](https://github.com/YoungWorldTechnology/lb-frontend/actions/workflows/build-cw-stating.yaml/badge.svg)](https://github.com/YoungWorldTechnology/lb-frontend/actions/workflows/build-cw-stating.yaml) |

# Line Base Frontend

## Config `.env` (change by your own)
```
############# APP configs #############
VUE_APP_ROOT_API=https://lb-dev.fireapps.tech
VUE_APP_API_VER=/api/v1
VUE_APP_SOCKET_URL=https://lb-dev.fireapps.tech
VUE_APP_FILE_URL=https://lb-media-dev.alireviews.io
VUE_APP_CONTACT_AVATAR_URL=https://ssl.gstatic.com/docs/common/profile
VUE_APP_WIDGET_URL=https://lb-cw-dev.fireapps.tech

############# WIDGET configs #############
WIDGET_DEBUG_MODE=true
WIDGET_DEMO_MODE=false
WIDGET_DEMO_DOMAIN=https://lb-fe-dev.fireapps.tech
WIDGET_DEMO_ORG_ID=60be634eb9a0847ad87a9b04
WIDGET_DEMO_WS_ID=60be634eb9a0847ad87a9b05

# Widget path setting
# WIDGET_DIST_PATH=./dist-widget
# WIDGET_SRC_PATH=./src/widget

############# Firebase Cloud Messaging #############
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

## In-app setup (main app screen)

### Compiles and minifies for production (./dist)
```
npm install
npm run i18n:sheet // Generate multi-language i18n from spreadsheet file
npm run build
```

### Compiles and hot-reloads for development (./dist)
```
npm install
npm run i18n:sheet
npm start
```

### Run your unit tests
```
npm install
npm run i18n:sheet
npm run test:unit
```

### Lints and fixes files
```
npm install
npm run i18n:sheet
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Component Datepicker, Multi Select (Select, Search Option, ...)

### Color Picker
See (https://baianat.github.io/verte/examples.html)

### Tailwind Css
See (https://tailwindcss.com/docs)

### Chart Apexcharts
See (https://apexcharts.com/docs/vue-charts/)

### Validate Form
See (https://vuelidate-next.netlify.app/)

## Chat widget setup (balloon in front site)

### Compiles and minifies for production (./dist-widget)
```
npm install
npm run build:widget
```

### Compiles and hot-reloads for development (./dist-widget)
```
npm install
npm run build:widget-dev
```
