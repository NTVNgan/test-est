import { createRouter, createWebHistory, RouteRecordRaw, RouteParams } from 'vue-router';
import { AppRouteNames } from '@/types/router-name';
import { useRoute } from '@/composables/useRoute';
import { useSocket } from '@/composables/useSocket';
import { store } from '@/store';
import storage from '@/utils/storage';
import jwt from 'jsonwebtoken';
import { useUser } from './modules/auth/composables/useUser';
import { useOrg } from './modules/org/composable/useOrg';
import { useRole } from '@/composables/useRole';
import { useLinebase } from '@/composables/useLinebase';
import { showPopupOutSession } from '@/plugins/axios';
import database, { dbName } from '@/database';
import { useFireabaseMessaging } from './composables/useFirebaseMessaging';

const { routes } = useRoute();
const publicRouteName = ['SignIn', 'SignUp', 'ForgotPassword', 'CreatePassword'];
const errorRouteName = ['Error', 'Error500', 'Error404'];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

const { handleSubscribe } = useFireabaseMessaging();

let newVal: any = {};
const installDatabase = (account_id: any) => {
    /*
      This function create local database (use IndexedDB) to store recently emojis, recently stickers
    */
    newVal[account_id] = [];
    /* Create emoji database */
    database.getItem(dbName.emoji, (err, value: any) => {
        if (!value) {
            database.setItem(dbName.emoji, newVal);
        } else {
            if (!value[account_id]) {
                newVal = value;
                newVal[account_id] = [];
                database.setItem(dbName.emoji, newVal);
            }
        }
    });
    /* Create list emoji database */
    database.getItem(dbName.listEmoji, (err, value: any) => {
        if (!value) {
            database.setItem(dbName.listEmoji, newVal);
        } else {
            if (!value[account_id]) {
                newVal = value;
                newVal[account_id] = [];
                database.setItem(dbName.listEmoji, newVal);
            }
        }
    });
    /* Create emoji database in Setting Chat widget */
    database.getItem(dbName.widgetSetingEmoji, (err, value: any) => {
        if (!value) {
            database.setItem(dbName.widgetSetingEmoji, newVal);
        } else {
            if (!value[account_id]) {
                newVal = value;
                newVal[account_id] = [];
                database.setItem(dbName.widgetSetingEmoji, newVal);
            }
        }
    });
    /* Create list count emoji database in Setting Chat widget */
    database.getItem(dbName.widgetSetingEmojiCount, (err, value: any) => {
        if (!value) {
            database.setItem(dbName.widgetSetingEmojiCount, newVal);
        } else {
            if (!value[account_id]) {
                newVal = value;
                newVal[account_id] = [];
                database.setItem(dbName.widgetSetingEmojiCount, newVal);
            }
        }
    });
};

router.beforeEach(async (to, from, next) => {
    const { getUserById, getRootUser, getUserList } = useUser();
    const { getOrg } = useOrg();
    const { getRole } = useRole();
    const { installSocket, socket } = useSocket();
    const token: any = storage.get('user');
    const isLoggedIn = !!token;
    const isOnPublicRouteName = typeof to.name === 'string' ? publicRouteName.includes(to.name) : null;
    const isOnErrorRouteName = typeof to.name === 'string' ? errorRouteName.includes(to.name) : null;
    const isDSRoute = to.path.includes('design-system');
    const isHaveSocket = !(Object.keys(socket).length === 0 && socket.constructor === Object);

    if (isLoggedIn) {
        if (!store.state.auth.user) {
            const decode: any = jwt.decode(token.token);
            if (!decode) {
                store.dispatch('auth/logout');
            } else {
                const userId = decode.data._id;
                if (userId) {
                    installDatabase(userId);
                }
                let userData = null;
                try {
                    userData = await getRootUser();
                    if (userData.org_id) {
                        await getOrg(userData.org_id);
                    }
                    await getRole();
                    await getUserList();
                } catch (e) {
                    if (Object.prototype.hasOwnProperty.call(e, 'user_not_found')) store.commit('auth/LOGOUT');
                }

                if (userData) {
                    // Install linebase chatwidget
                    useLinebase().loadScript(userData, () => console.log(':: LOADED 2 ::'));

                    await store.commit('auth/UPDATE_USER_AUTH', userData, { root: true });
                    handleSubscribe();
                }
            }
        }

        if (store.state.auth.user && !isHaveSocket) {
            const userId = store.state.auth.user._id;
            // Install linebase chatwidget
            useLinebase().loadScript(store.state.auth.user, () => console.log(':: LOADED 2 ::'));
            if (userId) {
                installDatabase(userId);
            }
            try {
                const socket = await installSocket(store.state.auth.user);
                await socket.emit('joinRoom', { room_id: store.state.auth.user.workspace_id });
                await socket.emit('joinRoom', { room_id: store.state.auth.user._id });
            } catch (e) {
                console.log({ e });
            }
        }
    }

    // const isSettingOrg = store.state.auth.user ? store.state.auth.user.is_setting_org : null;
    const isSettingOrg =
        store.state.auth.user?.workspace?.name !== '' && store.state.auth.user?.workspace?.name !== null;
    const decode: any = jwt.decode(isLoggedIn && token.token);
    const id_store = store.state.auth.user && store.state.auth.user._id;
    const id_token = decode ? decode.data._id : null;

    if (isDSRoute || isOnErrorRouteName || to.path === '/set-new-password' || to.path === '/create-password') {
        return next();
    } else if (!isOnPublicRouteName && !isLoggedIn) {
        return next({ name: 'SignIn' });
    } else if (isLoggedIn && !isSettingOrg && to.path !== '/setting-org') {
        return next({ name: 'InputCompanyName' });
    } else if (to.path === '/setting-org' && isLoggedIn && isSettingOrg) {
        return next('/inbox');
    } else if (from.path !== '/setting-org' && to.path === '/invite-teammate' && isLoggedIn && isSettingOrg) {
        return next('/inbox');
    } else if (from.path === 'setting-org' && to.path === '/invite-teammate' && isLoggedIn && isSettingOrg) {
        return next('/invite-teammate');
    } else if (isOnPublicRouteName && isLoggedIn) {
        return next('/inbox');
    } else if (to.path === '/' && isLoggedIn && isSettingOrg) {
        return next('/inbox');
    } else if (isLoggedIn && id_store !== id_token && store.state.auth.user !== null) {
        showPopupOutSession.value = true;
    }
    next();
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.middleware) {
        const middleware: any = to.meta.middleware;
        const context = { next, from, to, router, store };
        let preventNext = false;
        for (let i = 0; i < middleware.length; i++) {
            const result = await middleware[i](context);
            if (!result) {
                preventNext = true;
                break;
            }
        }
        if (preventNext) {
            return;
        }
    }

    next();
});

export function routerPush(name: AppRouteNames, params?: RouteParams): ReturnType<typeof router.push> {
    if (params !== undefined) {
        return router.push({
            name,
            params,
        });
    } else {
        return router.push({ name });
    }
}

export { router };
