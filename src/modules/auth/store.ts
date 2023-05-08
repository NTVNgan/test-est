import { services } from './services';
import storage from '@/utils/storage';
import { Commit } from 'vuex';
import { AxiosResponse } from 'axios';
const namespaced = true;
import jwt from 'jsonwebtoken';
import { router } from '@/router';
import { reactive } from 'vue';
import { useSocket } from '@/composables/useSocket';
import { useLinebase } from '@/composables/useLinebase';
import { useUser } from '@/modules/auth/composables/useUser';
import { useRole } from '@/composables/useRole';
import { useFireabaseMessaging } from '@/composables/useFirebaseMessaging';
import { useManageVariable } from '@/composables/useManageVariable';

interface State {
    user: User | any;
    userWorkspaces: UserWorkspace[] | null;
}

const state: State = reactive({
    user: null,
    userWorkspaces: null,
});

const { clearSocket } = useSocket();
const { clearVariable } = useManageVariable();
const { handleSubscribe, removeToken } = useFireabaseMessaging();

const actions = {
    login({ commit }: { commit: Commit }, payload: LoginForm) {
        const { getUserList } = useUser();
        const { getRole } = useRole();
        return services.login(payload).then(async (res: AxiosResponse<Res<{ access_token: string }>>) => {
            const { data } = res;
            const { error, message } = data;
            if (!error && data.data) {
                const userData = {
                    token: data.data.access_token,
                };
                await commit('auth/UPDATE_USER_AUTH', userData, { root: true });
                handleSubscribe();
                router.push('/inbox');
                await getRole();
                await getUserList();
            } else if (error && Object.keys(message as any)[0] === 'please_choose_workspaces') {
                await commit('auth/UPDATE_USER_WORKSPACES', data.data, { root: true });
                return Promise.reject(data.message);
            } else {
                return Promise.reject(data.message);
            }
        });
    },
    logout({ commit }: { commit: Commit }) {
        removeToken();
        return services
            .logout()
            .then((res: AxiosResponse<null>) => {
                if (res.status === 200) {
                    clearSocket();
                    clearVariable();
                    commit('LOGOUT');
                    document.title = 'LineBase';
                } else {
                    handleSubscribe();
                }
            })
            .catch((err: string[]) => console.log(err));
    },
    forgotPassword({ commit }: { commit: Commit }, payload: string) {
        return services
            .forgotPassword(payload)
            .then((res: AxiosResponse<Res<{ data: string }>>) => {
                const { data } = res;
                const { error } = data;
                if (error) {
                    return Promise.reject(data.message);
                }
            })
            .catch((err: any) => Promise.reject(err));
    },
    verifyLinkSetNewPass({ commit }: { commit: Commit }, urlParams: string) {
        return services.verifyLinkSetNewPass(urlParams).then((res: AxiosResponse<Res<{ data: any }>>) => {
            const { data } = res;
            const { error } = data;
            if (error) {
                return Promise.reject(data.message);
            }
        });
    },
    resetNewPass({ commit }: { commit: Commit }, payload: ResetNewPass) {
        console.log(payload.urlParams);
        return services.resetNewPass(payload).then((res: AxiosResponse<Res<{ data: any }>>) => {
            const { data } = res;
            const { error } = data;
            if (error) {
                return Promise.reject(data.message);
            }
        });
    },
    createPassTeamate({ commit }: { commit: Commit }, payload: CreatePassForm) {
        return services.createPassTeamate(payload).then((res: AxiosResponse<Res<{ data: any }>>) => {
            const { data } = res;
            const { error } = data;
            if (error) {
                return Promise.reject(data.message);
            }
        });
    },
};

const mutations = {
    // eslint-disable-next-line
    UPDATE_USER_AUTH({}: { commit: Commit }, userData: UserAuth) {
        if (userData.token) {
            storage.set('user', userData);
            const decode: any = jwt.decode(userData.token);
            state.user = decode.data;

            // Install linebase chatwidget
            // useLinebase().loadScript(decode.data, () => console.log(':: LOADED ::'));
        } else {
            state.user = userData;
        }
    },
    // eslint-disable-next-line no-empty-pattern
    UPDATE_USER_WORKSPACES({}: { commit: Commit }, userWorkspaces: UserWorkspace[]) {
        state.userWorkspaces = userWorkspaces;
    },
    LOGOUT() {
        // Remove linebase chatwidget
        // useLinebase().clearScript();

        storage.remove('user');
        router.push({ name: 'SignIn' });
        state.user = null;
        state.userWorkspaces = null;
    },
};

export default { namespaced, actions, state, mutations };
