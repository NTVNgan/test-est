<template>
    <div class="relative w-full">
        <template v-if="!isShowResponse && !isShowLoading">
            <router-link
                :to="{ name: 'SignIn' }"
                class="absolute left-52p top-32p z-999 text-14 text-primary-500 cursor-pointer flex items-center"
            >
                <icon-component name="LongArrowLeft" color="primary-500" class="mr-2p" />
                {{ $t('slp.auth_navigate_signin') }}
            </router-link>
        </template>
        <template v-if="isShowLoading">
            <LoadingScreen />
        </template>
        <template v-else>
            <div v-if="!isShowResponse" class="py-168p w-416 mx-auto">
                <h3 class="font-heading text-36 font-semibold text-primary-500">
                    {{ $t('slp.set_new_pass_text_set_new') }}
                </h3>
                <h4 class="text-14 text-neutrals-500 mt-12p mb-48p">
                    {{ $t('slp.set_new_pass_subtitle_set_new') }}
                </h4>
                <Alert v-if="errorValue" class="mb-24p" :type="'error'" :close="false" nameIcon="exclamation-circle">
                    <template v-slot:message>
                        <div class="text-14">
                            <p>{{ $t(`slp.set_new_pass_error_${errorValue}`) }}</p>
                        </div>
                    </template>
                </Alert>
                <form @submit="onSubmitNewPass">
                    <Input
                        class="input--auth"
                        type="password"
                        v-model="passwordValue"
                        :placeholder="$t('slp.set_new_pass_placeholder_new_password')"
                        v-on:keydown.enter="onSubmitNewPass"
                    >
                        <template v-slot:prefix
                            ><svg
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
                    <div class="mt-16p text-14 text-neutrals-300" v-if="!showSuccessPass">
                        <div class="grid grid-cols-2">
                            <p class="flex items-center" :class="{ 'text-neutrals-900': checkFormatPassword.upper }">
                                <icon-component
                                    name="check"
                                    :color="checkFormatPassword.upper ? 'success-3' : 'neutrals-300'"
                                />
                                {{ $t('common.requied_uppercase_password') }}
                            </p>
                            <p class="flex items-center" :class="{ 'text-neutrals-900': checkFormatPassword.lower }">
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
                    <Input
                        :state="checkConfirmPassword ? 'error' : 'primary'"
                        class="input--auth mt-24p"
                        type="password"
                        v-model="confirmPasswordValue"
                        :placeholder="$t('slp.set_new_pass_placeholder_confirm_password')"
                        v-on:keydown.enter="onSubmitNewPass"
                    >
                        <template v-slot:prefix
                            ><svg
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
                    <span v-if="checkConfirmPassword" class="inline-block text-error-3 mt-8p">
                        {{ $t('slp.set_new_pass_error_not_match_confirm_password') }}
                    </span>
                    <Button :disabled="validateForm" class="button--auth w-fill mt-48p" @click="onSubmitNewPass">
                        <template v-if="!loading">{{ $t('slp.set_new_pass_btn_change_password') }}</template>
                        <template v-else>
                            <Spinner size="small" color="#fff" />
                        </template>
                    </Button>
                </form>
            </div>
            <template v-else>
                <Response v-if="response === 'success'" :srcImg="'images/success.png'">
                    <template v-slot:title> {{ $t('slp.set_new_pass_res_password_changed_title') }} </template>
                    <template v-slot:body>
                        <p class="text-14 text-neutrals-400 mt-16p mb-40p">
                            {{ $t('slp.set_new_pass_res_password_changed_subtitle') }}
                        </p>
                        <router-link :to="{ name: 'SignIn' }" class="block">
                            <Button size="medium"> {{ $t('slp.set_new_pass_btn_go_login') }} </Button>
                        </router-link>
                    </template>
                </Response>
                <Response v-if="response === 'invalid_url'" :srcImg="'images/error-expired.png'">
                    <template v-slot:title> {{ $t('slp.set_new_pass_res_linked_invalid_title') }} </template>
                    <template v-slot:body>
                        <p
                            class="text-14 text-neutrals-400 mt-16p"
                            v-html="$t('slp.set_new_pass_res_linked_invalid_subtitle')"
                        ></p>
                        <p class="text-14 text-neutrals-400 flex">
                            {{ $t('slp.set_new_pass_res_linked_invalid_or') }}
                            <router-link :to="{ name: 'ForgotPassword' }" class="block">
                                <Button type="link" size="medium">
                                    {{ $t('slp.set_new_pass_btn_go_reset_password') }}
                                </Button>
                            </router-link>
                            {{ $t('slp.set_new_pass_res_linked_invalid_repeat') }}
                        </p>
                    </template>
                </Response>
                <Response v-if="response === 'expired_url'" :srcImg="'images/error-expired.png'">
                    <template v-slot:title> {{ $t('slp.set_new_pass_res_error_expired_title') }} </template>
                    <template v-slot:body>
                        <p class="text-14 text-neutrals-400 mt-16p mb-40p flex">
                            <router-link :to="{ name: 'ForgotPassword' }" class="block">
                                <Button type="link" size="medium">
                                    {{ $t('slp.set_new_pass_btn_go_reset_password') }}
                                </Button>
                            </router-link>
                            {{ $t('slp.set_new_pass_res_footer') }}
                        </p>
                    </template>
                </Response>
                <Response v-if="response === 'used_url'" :srcImg="'images/link-used.png'">
                    <template v-slot:title> {{ $t('slp.set_new_pass_res_linked_used_title') }} </template>
                    <template v-slot:body>
                        <p class="text-14 text-neutrals-400 mt-16p mb-40p flex">
                            <router-link :to="{ name: 'ForgotPassword' }" class="block">
                                <Button type="link" size="medium">
                                    {{ $t('slp.set_new_pass_btn_go_reset_password') }}
                                </Button>
                            </router-link>
                            {{ $t('slp.set_new_pass_res_footer') }}
                        </p>
                    </template>
                </Response>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, inject } from 'vue';
import Response from '../components/AuthResponse.vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';
import LoadingScreen from '../components/AuthLoadingScreen.vue';
import { useRoute } from 'vue-router';
import { routerPush } from '@/router';
import { useAuth } from '../composables/useAuth';
import { useValidatePassword } from '@/composables/useValidatePassword';

export default defineComponent({
    name: 'SetNewPassword',
    components: {
        Response,
        Button,
        Input,
        Alert,
        Spinner,
        IconComponent,
        LoadingScreen,
    },
    setup() {
        const emitter: any = inject('emitter');
        const response = ref<string>('success'); // success | invalid_url | expired_url | used_url
        const confirmPasswordValue = ref<string>('');
        const currentPass = ref<string>('');
        const isShowResponse = ref<boolean>(false);
        const isShowLoading = ref<boolean>(false);
        const countValidatePassword = ref<number>(0);
        const errorValue = ref<string>('');

        const route = useRoute();
        const { resetNewPass, verifyLinkSetNewPass, error, loading } = useAuth();
        const { passwordValue, checkFormatPassword, showSuccessPass } = useValidatePassword();

        const queryParams = computed(() => route.fullPath.split('?')[1]);
        const checkConfirmPassword = computed(() => {
            if (passwordValue.value && confirmPasswordValue.value) {
                if (showSuccessPass.value || countValidatePassword.value > 0) {
                    // eslint-disable-next-line
                    countValidatePassword.value = 1;
                    return passwordValue.value !== confirmPasswordValue.value;
                }
            }
            // eslint-disable-next-line
            countValidatePassword.value = 0;
            return false;
        });

        const validateForm = computed(() => {
            if (!showSuccessPass.value) {
                return true;
            } else {
                if (errorValue.value === 'password_was_used') {
                    if (currentPass.value === passwordValue.value && currentPass.value === confirmPasswordValue.value) {
                        return true;
                    }
                    if (currentPass.value !== passwordValue.value && currentPass.value !== confirmPasswordValue.value) {
                        return passwordValue.value !== confirmPasswordValue.value;
                    }
                    return true;
                } else {
                    return passwordValue.value !== confirmPasswordValue.value;
                }
            }
        });

        const verifyLink = async () => {
            isShowLoading.value = true;
            if (queryParams.value) {
                await verifyLinkSetNewPass(queryParams.value);
                if (error.value) {
                    if (Object.keys(error.value)[0] === 'email') {
                        routerPush('Error404');
                        return;
                    }
                    response.value = Object.keys(error.value)[0];
                    isShowResponse.value = true;
                }
                isShowLoading.value = false;
            } else {
                routerPush('Error404');
            }
        };

        const onSubmitNewPass = async () => {
            if (validateForm.value) return;
            await resetNewPass({ urlParams: queryParams.value, password: passwordValue.value });
            if (error.value !== null) {
                errorValue.value = Object.keys(error.value)[0];
                if (error.value.message === 'Network Error') {
                    isShowLoading.value = false;
                    return;
                }
                if (errorValue.value !== 'password_was_used') {
                    response.value = Object.keys(error.value)[0];
                    isShowResponse.value = true;
                } else {
                    currentPass.value = JSON.parse(JSON.stringify(passwordValue.value));
                }
            } else {
                isShowResponse.value = true;
                response.value = 'success';
            }
        };

        onMounted(() => {
            verifyLink();
        });

        emitter.on('isOnline', (value: boolean) => {
            if (value) {
                isShowLoading.value = false;
                currentPass.value = '';
                passwordValue.value = '';
                confirmPasswordValue.value = '';
            }
        });

        return {
            isShowResponse,
            isShowLoading,
            passwordValue,
            checkFormatPassword,
            checkConfirmPassword,
            showSuccessPass,
            confirmPasswordValue,
            onSubmitNewPass,
            error,
            loading,
            response,
            errorValue,
            validateForm,
            currentPass,
        };
    },
});
</script>

<style lang="scss" scoped>
.text-36 {
    line-height: 40px;
}
</style>
