<template>
    <div class="auth-signin relative w-full">
        <div
            @click="logout"
            class="absolute left-52p top-32p z-999 text-14 text-primary-500 cursor-pointer flex items-center"
        >
            <icon-component name="LongArrowLeft" color="primary-500" class="mr-2p" />
            {{ $t('slp.auth_navigate_signin') }}
        </div>
        <div class="py-168p w-416 mx-auto">
            <h3 class="font-heading text-30 text-primary-500">Next,</h3>
            <h4 class="font-heading text-36 font-semibold text-primary-500">What the name of your company?</h4>
            <form>
                <Input
                    :state="v$.companyValue.minLengthValue.$invalid ? 'error' : 'primary'"
                    class="input--auth mt-48p"
                    v-model.trim="companyValue"
                    placeholder="Enter company name"
                    type="text"
                    :maxlength="50"
                    v-on:keydown.enter.prevent="onUpdateOrgName"
                >
                    <template v-slot:prefix
                        ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.5 6.67969C10.5 6.44531 10.2656 6.21094 10.0312 6.21094H8.46875C8.19531 6.21094 8 6.44531 8 6.67969V8.24219C8 8.51562 8.19531 8.71094 8.46875 8.71094H10.0312C10.2656 8.71094 10.5 8.51562 10.5 8.24219V6.67969ZM15.0312 6.21094H13.4688C13.1953 6.21094 13 6.44531 13 6.67969V8.24219C13 8.51562 13.1953 8.71094 13.4688 8.71094H15.0312C15.2656 8.71094 15.5 8.51562 15.5 8.24219V6.67969C15.5 6.44531 15.2656 6.21094 15.0312 6.21094ZM10.0312 9.96094H8.46875C8.19531 9.96094 8 10.1953 8 10.4297V11.9922C8 12.2656 8.19531 12.4609 8.46875 12.4609H10.0312C10.2656 12.4609 10.5 12.2656 10.5 11.9922V10.4297C10.5 10.1953 10.2656 9.96094 10.0312 9.96094ZM15.0312 9.96094H13.4688C13.1953 9.96094 13 10.1953 13 10.4297V11.9922C13 12.2656 13.1953 12.4609 13.4688 12.4609H15.0312C15.2656 12.4609 15.5 12.2656 15.5 11.9922V10.4297C15.5 10.1953 15.2656 9.96094 15.0312 9.96094ZM10.0312 13.7109H8.46875C8.19531 13.7109 8 13.9453 8 14.1797V15.7422C8 16.0156 8.19531 16.2109 8.46875 16.2109H10.0312C10.2656 16.2109 10.5 16.0156 10.5 15.7422V14.1797C10.5 13.9453 10.2656 13.7109 10.0312 13.7109ZM15.0312 13.7109H13.4688C13.1953 13.7109 13 13.9453 13 14.1797V15.7422C13 16.0156 13.1953 16.2109 13.4688 16.2109H15.0312C15.2656 16.2109 15.5 16.0156 15.5 15.7422V14.1797C15.5 13.9453 15.2656 13.7109 15.0312 13.7109ZM20.5 21.7188C20.5 21.4844 20.2656 21.25 20.0312 21.25H19.25V3.4375C19.25 2.92969 18.8203 2.5 18.3125 2.5H5.1875C4.64062 2.5 4.25 2.92969 4.25 3.4375V21.25H3.46875C3.19531 21.25 3 21.4844 3 21.7188V22.5H20.5V21.7188ZM18 21.25H13V17.9297C13 17.6953 12.7656 17.4609 12.5312 17.4609H10.9688C10.6953 17.4609 10.5 17.6953 10.5 17.9297V21.25H5.5V3.75H18V21.25Z"
                                fill="#A4A4AE"
                            />
                        </svg>
                    </template>
                </Input>
                <span v-if="v$.companyValue.minLengthValue.$invalid" class="inline-block text-error-3 mt-8p"
                    >Your company name must be at least 3 characters.
                </span>

                <Button
                    :disabled="companyValue.trim().length < 3 || v$.companyValue.minLengthValue.$invalid"
                    class="button--auth w-fill mt-48p"
                    @click="onUpdateOrgName"
                >
                    <template v-if="!loading">
                        Next
                    </template>
                    <template v-else
                        ><svg
                            class="auth-signin__loader"
                            width="21"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.375 1.875C12.375 0.859375 11.5156 0 10.5 0C9.44531 0 8.625 0.859375 8.625 1.875C8.625 2.92969 9.44531 3.75 10.5 3.75C11.5156 3.75 12.375 2.92969 12.375 1.875ZM10.5 16.25C9.44531 16.25 8.625 17.1094 8.625 18.125C8.625 19.1797 9.44531 20 10.5 20C11.5156 20 12.375 19.1797 12.375 18.125C12.375 17.1094 11.5156 16.25 10.5 16.25ZM18.625 8.125C17.5703 8.125 16.75 8.98438 16.75 10C16.75 11.0547 17.5703 11.875 18.625 11.875C19.6406 11.875 20.5 11.0547 20.5 10C20.5 8.98438 19.6406 8.125 18.625 8.125ZM4.25 10C4.25 8.98438 3.39062 8.125 2.375 8.125C1.32031 8.125 0.5 8.98438 0.5 10C0.5 11.0547 1.32031 11.875 2.375 11.875C3.39062 11.875 4.25 11.0547 4.25 10ZM4.71875 13.9062C3.70312 13.9062 2.84375 14.7266 2.84375 15.7812C2.84375 16.7969 3.70312 17.6562 4.71875 17.6562C5.77344 17.6562 6.59375 16.7969 6.59375 15.7812C6.59375 14.7266 5.77344 13.9062 4.71875 13.9062ZM16.2422 13.9062C15.1875 13.9062 14.3672 14.7266 14.3672 15.7812C14.3672 16.7969 15.1875 17.6562 16.2422 17.6562C17.2578 17.6562 18.1172 16.7969 18.1172 15.7812C18.1172 14.7266 17.2578 13.9062 16.2422 13.9062ZM4.71875 2.38281C3.70312 2.38281 2.84375 3.24219 2.84375 4.25781C2.84375 5.3125 3.70312 6.13281 4.71875 6.13281C5.77344 6.13281 6.59375 5.3125 6.59375 4.25781C6.59375 3.24219 5.77344 2.38281 4.71875 2.38281Z"
                                fill="white"
                            />
                        </svg>
                    </template>
                </Button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import useVuelidate from '@vuelidate/core';
import { maxLength, minLength } from '@vuelidate/validators';
import { useAuth } from '@/modules/auth/composables/useAuth';
import { useUser } from '../composables/useUser';
import { useOrg } from '@/modules/org/composable/useOrg';
import { store } from '@/store';
import { useRouter } from 'vue-router';

export default {
    name: 'SignIn',
    validations() {
        return {
            companyValue: {
                minLengthValue: minLength(3),
                maxLengthValue: maxLength(100),
            },
        };
    },
    components: {
        Button,
        Input,
        IconComponent,
    },
    setup() {
        const companyValue = ref<string>('');
        const errorMessage = ref<string>('');
        const isRemember = ref<boolean>(false);
        const isError = ref<boolean>(false);
        const errorKey = ref<string | null>('');
        const { logout } = useAuth();
        const { updateOrg, loadingUpdateOrg: loading } = useOrg();
        const { getUserById } = useUser();
        const { org_id: orgId, _id: userId } = store.state.auth.user;
        const router = useRouter();
        const v$ = useVuelidate();

        const isSettingOrg = computed(() => store.state.auth.user.workspace?.name);

        const onUpdateOrgName = async () => {
            if (v$.value.$invalid) return;
            isError.value = false;
            try {
                const orgData = await updateOrg({ id: orgId, name: companyValue.value });
                if (orgData) {  
                    const userData = await getUserById(userId);
                    // console.log({userData})
                    userData && store.commit('auth/UPDATE_USER_AUTH', userData);
                    isSettingOrg.value && router.push({ name: 'InviteTeammate' });
                }
            } catch (e) {
                console.log({ e });
            }
        };

        return {
            loading,
            v$,
            isError,
            errorKey,
            errorMessage,
            isRemember,
            companyValue,
            onUpdateOrgName,
            logout,
        };
    },
};
</script>

<style lang="scss" scoped>
.auth-signin {
    h4 {
        font-weight: 600;
        line-height: 40px;
    }
    &__loader {
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
    }
}

@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
