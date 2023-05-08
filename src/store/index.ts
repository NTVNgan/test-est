import { createStore, createLogger } from 'vuex';
import auth from '@/modules/auth/store';

export const store : any = createStore({
    plugins: [createLogger()],
    state: {},
    mutations: {},
    actions: {},
    modules: { auth },
});
