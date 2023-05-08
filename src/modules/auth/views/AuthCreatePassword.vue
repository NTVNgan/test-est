<template>
    <div class="auth-create-password relative w-full">
        <div class="absolute right-52p top-32p">
            <template v-if="!isOnActiveMailFlow && !isSuccessPassword">
                {{ $t('slp.auth_navigate_already_account') }}
                <router-link :to="{ name: 'SignIn' }" class="text-primary-500 cursor-pointer">Log in</router-link>
            </template>
        </div>
        <div v-if="!isOnActiveMailFlow" class="py-168p w-416 mx-auto">
            <template v-if="!isSuccessPassword">
                <h3 class="font-heading text-30 text-primary-500">{{ $t('slp.create_pass_text_welcome') }}</h3>
                <h4 class="font-heading text-36 font-semibold text-primary-500 heading-bold mb-48p">
                    {{ $t('slp.create_pass_title') }}
                </h4>
                <form>
                    <Input
                        class="input--auth mt-24p"
                        type="password"
                        :placeholder="$t('slp.signup_placeholder_passoword')"
                        v-model="passwordValue"
                        v-on:keydown.enter="onCreatePass"
                    >
                        <template v-slot:prefix>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.125 3.75C18.2109 3.75 20.75 6.28906 20.75 9.375C20.75 12.5 18.2109 15 15.125 15C14.3828 15 13.6406 14.8828 13.0156 14.6094L11.375 16.25H9.5V18.75H7V21.25H3.25V18.125L9.89062 11.4844C9.61719 10.8594 9.5 10.1172 9.5 9.375C9.5 6.28906 12 3.75 15.125 3.75ZM15.125 2.5C11.2969 2.5 8.25 5.58594 8.25 9.375C8.25 10 8.28906 10.5859 8.44531 11.1328L2.27344 17.3438C2.11719 17.5 2 17.8125 2 18.0078V21.5625C2 22.1094 2.39062 22.5 2.9375 22.5H7.3125C7.82031 22.5 8.25 22.1094 8.25 21.5625V20H9.8125C10.3203 20 10.75 19.6094 10.75 19.0625V17.5H11.4922C11.7266 17.5 11.9609 17.4219 12.1562 17.2266L13.3672 16.0547C13.9141 16.2109 14.5 16.25 15.125 16.25C18.9141 16.25 22 13.2031 22 9.375C22 5.58594 18.9141 2.5 15.125 2.5ZM17 6.71875C17.4297 6.71875 17.7812 7.07031 17.7812 7.5C17.7812 7.96875 17.4297 8.28125 17 8.28125C16.5312 8.28125 16.2188 7.96875 16.2188 7.5C16.2188 7.07031 16.5312 6.71875 17 6.71875ZM17 5.625C15.9453 5.625 15.125 6.48438 15.125 7.5C15.125 8.55469 15.9453 9.375 17 9.375C18.0156 9.375 18.875 8.55469 18.875 7.5C18.875 6.48438 18.0156 5.625 17 5.625Z"
                                    fill="#A4A4AE"
                                />
                            </svg>
                        </template>
                    </Input>
                    <template v-if="showValidatePass">
                        <template v-if="showSuccessPass">
                            <span class="flex items-center text-success-3 text-16 mt-8p">
                                <icon-component name="check-circle-white" color="success-3" />
                                {{ $t('slp.signup_success_password') }}
                            </span>
                        </template>
                        <template v-else>
                            <div class="mt-16p text-14 text-neutrals-300">
                                <div class="grid grid-cols-2">
                                    <p
                                        class="flex items-center"
                                        :class="{ 'text-neutrals-900': checkFormatPassword.upper }"
                                    >
                                        <icon-component
                                            name="check"
                                            :color="checkFormatPassword.upper ? 'success-3' : 'neutrals-300'"
                                        />
                                        {{ $t('common.requied_uppercase_password') }}
                                    </p>
                                    <p
                                        class="flex items-center"
                                        :class="{ 'text-neutrals-900': checkFormatPassword.lower }"
                                    >
                                        <icon-component
                                            name="check"
                                            :color="checkFormatPassword.lower ? 'success-3' : 'neutrals-300'"
                                        />
                                        {{ $t('common.requied_lowercase_password') }}
                                    </p>
                                    <p
                                        class="flex items-center mt-8p"
                                        :class="{ 'text-neutrals-900': checkFormatPassword.number }"
                                    >
                                        <icon-component
                                            name="check"
                                            :color="checkFormatPassword.number ? 'success-3' : 'neutrals-300'"
                                        />
                                        {{ $t('common.requied_number_password') }}
                                    </p>
                                    <p
                                        class="flex items-center mt-8p"
                                        :class="{ 'text-neutrals-900': checkFormatPassword.special }"
                                    >
                                        <icon-component
                                            name="check"
                                            :color="checkFormatPassword.special ? 'success-3' : 'neutrals-300'"
                                        />
                                        {{ $t('common.requied_special_password') }}
                                    </p>
                                    <p
                                        class="flex items-center mt-8p"
                                        :class="{ 'text-neutrals-900': checkFormatPassword.min }"
                                    >
                                        <icon-component
                                            name="check"
                                            :color="checkFormatPassword.min ? 'success-3' : 'neutrals-300'"
                                        />
                                        {{ $t('common.requied_minimum_password') }}
                                    </p>
                                </div>
                            </div>
                        </template>
                    </template>
                    <Input
                        :state="
                            confirmPasswordValue && !v$.confirmPasswordValue.sameAsPassword.$response
                                ? 'error'
                                : 'primary'
                        "
                        class="input--auth mt-24p"
                        type="password"
                        :placeholder="$t('slp.create_pass_placeholder_confirm_pass')"
                        v-model="confirmPasswordValue"
                        v-on:keydown.enter="onCreatePass"
                    >
                        <template v-slot:prefix>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.125 3.75C18.2109 3.75 20.75 6.28906 20.75 9.375C20.75 12.5 18.2109 15 15.125 15C14.3828 15 13.6406 14.8828 13.0156 14.6094L11.375 16.25H9.5V18.75H7V21.25H3.25V18.125L9.89062 11.4844C9.61719 10.8594 9.5 10.1172 9.5 9.375C9.5 6.28906 12 3.75 15.125 3.75ZM15.125 2.5C11.2969 2.5 8.25 5.58594 8.25 9.375C8.25 10 8.28906 10.5859 8.44531 11.1328L2.27344 17.3438C2.11719 17.5 2 17.8125 2 18.0078V21.5625C2 22.1094 2.39062 22.5 2.9375 22.5H7.3125C7.82031 22.5 8.25 22.1094 8.25 21.5625V20H9.8125C10.3203 20 10.75 19.6094 10.75 19.0625V17.5H11.4922C11.7266 17.5 11.9609 17.4219 12.1562 17.2266L13.3672 16.0547C13.9141 16.2109 14.5 16.25 15.125 16.25C18.9141 16.25 22 13.2031 22 9.375C22 5.58594 18.9141 2.5 15.125 2.5ZM17 6.71875C17.4297 6.71875 17.7812 7.07031 17.7812 7.5C17.7812 7.96875 17.4297 8.28125 17 8.28125C16.5312 8.28125 16.2188 7.96875 16.2188 7.5C16.2188 7.07031 16.5312 6.71875 17 6.71875ZM17 5.625C15.9453 5.625 15.125 6.48438 15.125 7.5C15.125 8.55469 15.9453 9.375 17 9.375C18.0156 9.375 18.875 8.55469 18.875 7.5C18.875 6.48438 18.0156 5.625 17 5.625Z"
                                    fill="#A4A4AE"
                                />
                            </svg>
                        </template>
                    </Input>
                    <span
                        v-if="confirmPasswordValue && !v$.confirmPasswordValue.sameAsPassword.$response"
                        class="inline-block text-error-3 mt-8p"
                        >{{ $t('common.error_invalid_confirm_passord') }}</span
                    >
                    <Button
                        :disabled="!v$.confirmPasswordValue.sameAsPassword.$response || !passwordValue || !showSuccessPass"
                        class="button--auth w-fill mt-48p"
                        @click="onCreatePass"
                    >
                        {{ $t('slp.create_pass_button') }}
                    </Button>
                </form>
            </template>
            <template v-else>
                <Response :srcImg="'images/img-speaker.png'" :widthImg="'w-428'">
                    <template v-slot:title>
                        <h2>{{ $t('slp.create_pass_text_welcome') }}</h2>
                    </template>
                    <template v-slot:body>
                        <p class="text-14 text-neutrals-400 mt-16p mb-32p">
                            {{ $t('slp.create_pass_active_temmate') }}
                        </p>
                        <Button type="primary" @click="onExplore">
                            {{ $t('slp.create_pass_btn_explore') }}
                        </Button>
                    </template>
                </Response>
            </template>
        </div>
        <div v-else>
            <Response
                v-if="['invalid_url', 'expired_url'].includes(activeMailStatus)"
                :srcImg="'images/error-expired.png'"
            >
                <template v-slot:title>
                    <h2 v-if="activeMailStatus === 'invalid_url'">{{ $t('slp.create_pass_invalid_title') }}</h2>
                    <h2 v-else>{{ $t('slp.create_pass_expired_title') }}</h2>
                </template>
                <template v-slot:body>
                    <p class="text-14 text-neutrals-400 mt-16p mb-40p">
                        <template v-if="activeMailStatus === 'invalid_url'">
                            <span v-html="$t('slp.create_pass_invalid_text_title')" />
                            <Button type="link" size="medium" @click="onChangeRouteActiveLink('SignUp')">
                                {{ $t('slp.create_pass_invalid_link') }}
                            </Button>
                            <span>{{ $t('slp.create_pass_invalid_text_title2') }}</span>
                        </template>
                        <template v-if="activeMailStatus === 'expired_url'">
                            <span>{{ $t('slp.create_pass_expired_subtitle') }}</span>
                            <Button type="link" size="medium" @click="onChangeRouteActiveLink('SignIn')">
                                {{ $t('slp.create_pass_link') }}
                            </Button>
                        </template>
                    </p>
                </template>
            </Response>
            <Response v-else-if="activeMailStatus === 'used_url'" :srcImg="'images/link-used.png'">
                <template v-slot:title>
                    <h2>
                        {{ $t('slp.create_pass_used_title') }}
                    </h2>
                </template>
                <template v-slot:body>
                    <p class="text-14 text-neutrals-400 mt-16p mb-40p">
                        <span>{{ $t('slp.create_pass_used_text_title') }}</span>
                        <br />
                        <Button type="link" size="medium" @click="onChangeRouteActiveLink('SignIn')">
                            {{ $t('slp.create_pass_link') }}
                        </Button>
                        <span>{{ $t('slp.create_pass_used_text_subtitle') }}</span>
                    </p>
                </template>
            </Response>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, inject, onMounted } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import { useValidatePassword } from '@/composables/useValidatePassword';
import Response from '../components/AuthResponse.vue';
import { useRoute } from 'vue-router';
import { sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useAuth } from '../composables/useAuth';
import { routerPush } from '@/router';
import { services } from '../services';
import { AppRouteNames } from '@/types/router-name';

export default defineComponent({
    name: 'CreatePassword',
    components: {
        Input,
        IconComponent,
        Button,
        Response,
    },
    validations() {
        return {
            confirmPasswordValue: { sameAsPassword: sameAs(useValidatePassword().passwordValue) },
        };
    },
    setup() {
        const showValidatePass = ref<boolean>(true);
        const isOnActiveMailFlow = ref<boolean>(false);
        const isSuccessPassword = ref<boolean>(false);
        const activeMailStatus = ref<string>('');
        const { passwordValue, checkFormatPassword, showSuccessPass } = useValidatePassword();
        const { login, logout, cretePassTeamate, error, loading } = useAuth();

        const { query } = useRoute();
        const { hash, user_id: userId }: any = query;
        const v$ = useVuelidate();
        const confirmPasswordValue = ref<any>();
        const emailValue = ref<string>('');

        const onActiveMail = async () => {
            isOnActiveMailFlow.value = true;
            if (hash && userId) {
                const res = await services.activeInvateMail({ user_id: userId, hash });
                console.log(res);
                if (res) {
                    const { data: resData } = res;
                    const { error, data, message } = resData;
                    if (!error && data) {
                        activeMailStatus.value = 'done';
                        isOnActiveMailFlow.value = false;
                        emailValue.value = data.email;
                    } else if (error) {
                        activeMailStatus.value = Object.keys(message)[0];
                    }
                }
            } else {
                routerPush('Error404');
            }
        };

        const onCreatePass = async () => {
            const valConfirmPass = JSON.parse(JSON.stringify(v$.value.confirmPasswordValue)).sameAsPassword.$response;
            if (passwordValue.value && showSuccessPass.value === true && valConfirmPass === true) {
                await cretePassTeamate({ user_id: userId, hash: hash, password: passwordValue.value });
                if (!error.value) {
                    isSuccessPassword.value = true;
                }
                // routerPush('InboxGroups', { name: 'assign_to_you' });
                // console.log(error.value);
            }
        };

        const onChangeRouteActiveLink = async (routeName: AppRouteNames) => {
            await logout();
            routerPush(routeName);
        };

        onMounted(() => {
            onActiveMail();
        });

        const onExplore = async () => {
            logout();
            if (emailValue.value && passwordValue.value) {
                const test = await login({
                    email: emailValue.value,
                    password: passwordValue.value,
                    remember_me: false,
                });
                if (error.value === null) {
                    routerPush('InboxGroups', { name: 'assign_to_you' });
                }
            }
        };

        return {
            showValidatePass,
            showSuccessPass,
            checkFormatPassword,
            passwordValue,
            isOnActiveMailFlow,
            isSuccessPassword,
            activeMailStatus,
            confirmPasswordValue,
            v$,
            onCreatePass,
            onExplore,
            emailValue,
            onChangeRouteActiveLink,
        };
    },
});
</script>

<style lang="scss" scoped>
.auth-create-password {
    .heading-bold {
        line-height: 40px;
    }
}
</style>
