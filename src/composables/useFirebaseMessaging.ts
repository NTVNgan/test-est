import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { services } from '../modules/auth/services';
import { store } from '@/store';
import { ref } from 'vue';

const firebaseToken: any = ref(null);

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const handleSubscribe = async () => {
    if (!store.state.auth.user) {
        console.log('User not loggin');
        return;
    }
    if (Notification.permission === 'denied') {
        console.warn('The user has blocked notifications.');
        return;
    }
    if (!('PushManager' in window)) {
        console.warn("Push messaging isn't supported.");
        return;
    }
    getToken(messaging, {
        vapidKey: process.env.VUE_APP_FIREBASE_VAPID_KEY,
    }).then(async token => {
        try {
            firebaseToken.value = token;
            const res = await services.updateUser({ notification_device_token_add: token });
            const { data, error } = res.data;
            if (!error) {
                console.log('connect data messaging', data);
            }
        } catch (e) {
            console.error('connect data messaging error', { e });
        }
    });
};

const removeToken = async () => {
    try {
        if (firebaseToken.value) {
            const res = await services.updateUser({ notification_device_token_remove: firebaseToken.value });
            const { data, error } = res.data;
            if (!error) {
                console.log('disconnect data messaging', data);
                firebaseToken.value = null;
            }
        }
    } catch (e) {
        console.error('disconnect data messaging error', { e });
    }
};

export const useFireabaseMessaging = () => {
    return {
        handleSubscribe,
        removeToken,
    };
};
