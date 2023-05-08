<template>
    <ErrorPage :srcImg="'images/AccessDenied.svg'">
        <template v-slot:title>
            <h2>Access denied!</h2>
        </template>
        <template v-slot:body>
            <div>
                <p class="text-14 text-neutrals-400">
                    You don't have permission to access this page.<br />
                    Please contact your Administrator(s) to request access.
                </p>
                <button-component v-if="permission_group?.length>0" class="mt-24p" @click="$router.go(-2)">Go back</button-component>
                <button-component v-else class="mt-24p" @click="logout">Back to login</button-component>
            </div>
        </template>
    </ErrorPage>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ErrorPage from '../components/Error.vue';
// import { useRoute } from 'vue-router';
import { routerPush } from '@/router';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { store } from '@/store';
import { useAuth } from '@/modules/auth/composables/useAuth';

export default defineComponent({
    name: 'ErrorAccessDenied',
    components: {
        ErrorPage,
        ButtonComponent,
    },
    created: function () {
        // Redirect outside the app using plain old javascript
        routerPush('ErrorAccessDenied');
    },
    setup() {
        const { logout } = useAuth();
        const permission_group: any = computed(() => {
            return store.state.auth.user?.permission_group;
        });

        return {
            permission_group,
            logout
        };
    },
});
</script>
