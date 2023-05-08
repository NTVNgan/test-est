<template>
    <modal-component :custom-class="'py-24p'" :width="'464px'" class="model-change-password">
        <template v-slot:header>
            <div class="flex">
                <span class="font-medium text-16">{{ $t('slp.change_password_title') }}</span>
            </div>
        </template>
        <template v-slot:body>
            <div class="change-password px-32p">
                <form>
                    <div class="text-14 mb-4p font-medium">
                        {{ $t('slp.change_password_input_current_pass_label') }}
                    </div>
                    <Input
                        :state="checkError('your_current_password_was_map_incorrect') ? 'error' : 'primary'"
                        type="password"
                        v-model="currentPassword"
                        :placeholder="$t('slp.change_password_input_current_pass_placeholder')"
                    >
                    </Input>
                    <div
                        v-if="checkError('your_current_password_was_map_incorrect')"
                        class="text-error-3 text-14 mt-4p"
                    >
                        {{ errorListMessage['your_current_password_was_map_incorrect'] }}
                    </div>
                    <div class="text-14 mb-4p font-medium mt-24p">
                        {{ $t('slp.change_password_input_new_pass_label') }}
                    </div>
                    <Input
                        :state="
                            showSuccessPass && checkError('new_password_must_be_different_from_current_password')
                                ? 'error'
                                : 'primary'
                        "
                        type="password"
                        v-model="passwordValue"
                        :placeholder="$t('slp.change_password_input_new_pass_placeholder')"
                    >
                    </Input>
                    <div
                        v-if="checkError('new_password_must_be_different_from_current_password') && showSuccessPass"
                        class="text-error-3 text-14 mt-4p"
                    >
                        {{ errorListMessage['new_password_must_be_different_from_current_password'] }}
                    </div>
                    <slot v-if="showSuccessPass && !checkError('new_password_must_be_different_from_current_password')">
                        <div class="flex items-center text-success-3 text-16 mt-4p">
                            {{ $t('slp.signup_success_password') }}
                        </div>
                    </slot>
                    <slot v-else-if="!showSuccessPass">
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
                    </slot>
                    <div class="text-14 mb-4p font-medium mt-24p">
                        {{ $t('slp.change_password_input_confirm_pass_label') }}
                    </div>
                    <Input
                        :state="checkConfirmPassword ? 'error' : 'primary'"
                        type="password"
                        v-model="confirmPassword"
                        :placeholder="$t('slp.change_password_input_confirm_pass_placeholder')"
                    ></Input>
                    <div v-if="checkConfirmPassword" class="text-error-3 text-14 mt-4p">
                        {{ $t('slp.set_new_pass_error_not_match_confirm_password') }}
                    </div>
                </form>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end btn-bottom">
                <Button class="btn-cancel mr-8p" type="outline" size="medium" @click="clickCancel">{{
                    $t('slp.change_password_btn_cancel')
                }}</Button>
                <Button
                    :disabled="!showSuccessPass || !confirmPassword || !currentPassword || checkConfirmPassword"
                    @click="onSubmit"
                    size="medium"
                >
                    <template v-if="!loading"> {{ $t('slp.change_password_btn_change') }} </template>
                    <template v-else>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.375 1.875C12.375 0.859375 11.5156 0 10.5 0C9.44531 0 8.625 0.859375 8.625 1.875C8.625 2.92969 9.44531 3.75 10.5 3.75C11.5156 3.75 12.375 2.92969 12.375 1.875ZM10.5 16.25C9.44531 16.25 8.625 17.1094 8.625 18.125C8.625 19.1797 9.44531 20 10.5 20C11.5156 20 12.375 19.1797 12.375 18.125C12.375 17.1094 11.5156 16.25 10.5 16.25ZM18.625 8.125C17.5703 8.125 16.75 8.98438 16.75 10C16.75 11.0547 17.5703 11.875 18.625 11.875C19.6406 11.875 20.5 11.0547 20.5 10C20.5 8.98438 19.6406 8.125 18.625 8.125ZM4.25 10C4.25 8.98438 3.39062 8.125 2.375 8.125C1.32031 8.125 0.5 8.98438 0.5 10C0.5 11.0547 1.32031 11.875 2.375 11.875C3.39062 11.875 4.25 11.0547 4.25 10ZM4.71875 13.9062C3.70312 13.9062 2.84375 14.7266 2.84375 15.7812C2.84375 16.7969 3.70312 17.6562 4.71875 17.6562C5.77344 17.6562 6.59375 16.7969 6.59375 15.7812C6.59375 14.7266 5.77344 13.9062 4.71875 13.9062ZM16.2422 13.9062C15.1875 13.9062 14.3672 14.7266 14.3672 15.7812C14.3672 16.7969 15.1875 17.6562 16.2422 17.6562C17.2578 17.6562 18.1172 16.7969 18.1172 15.7812C18.1172 14.7266 17.2578 13.9062 16.2422 13.9062ZM4.71875 2.38281C3.70312 2.38281 2.84375 3.24219 2.84375 4.25781C2.84375 5.3125 3.70312 6.13281 4.71875 6.13281C5.77344 6.13281 6.59375 5.3125 6.59375 4.25781C6.59375 3.24219 5.77344 2.38281 4.71875 2.38281Z"
                                fill="white"
                            />
                        </svg>
                    </template>
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import { useProfile } from '../composables/useProfile';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { FormatPassword } from '@/types/format-password';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';

const errorListMessage: any = {
    your_current_password_was_map_incorrect: 'Your current password was incorrect.',
    new_password_must_be_different_from_current_password: 'Your new password must be different from current password.',
};

export default defineComponent({
    name: 'ChangePassword',
    components: {
        Button,
        Input,
        IconComponent,
        ModalComponent,
    },
    setup(props, context) {
        const confirmPassword = ref<string>('');
        const currentPassword = ref<string>('');
        const countValidatePassword = ref<number>(0);
        const passwordValue = ref<string>('');
        const listError = ref<Array<any>>([]);
        const isError = ref<boolean>(false);
        const { updatePassword, errorMessage, loading } = useProfile();
        const { addToast } = useToast();
        const { t } = useI18n();

        const checkFormatPassword = computed(() => {
            const formatPassword = ref<FormatPassword>({
                upper: false,
                lower: false,
                min: false,
                number: false,
                special: false,
            });
            if (passwordValue.value) {
                for (let i = 0; i < passwordValue.value.length; i++) {
                    const ch = passwordValue.value.charAt(i);
                    const regexUpper =
                        !new RegExp(/[a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểếễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/).test(
                            ch,
                        ) &&
                        new RegExp(
                            /[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸỬỮỰỲỴÝỶỸ]/,
                        ).test(ch);
                    if (regexUpper) {
                        formatPassword.value.upper = true;
                    }
                    const regexLower =
                        new RegExp(/[a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểếễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/).test(
                            ch,
                        ) &&
                        !new RegExp(
                            /[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸỬỮỰỲỴÝỶỸ]/,
                        ).test(ch);
                    if (regexLower) {
                        formatPassword.value.lower = true;
                    }
                    const regexMin = new RegExp(/\d/g);
                    if (regexMin.test(ch)) {
                        formatPassword.value.number = true;
                    }
                    const regexSpecial = new RegExp(/[-!@#$%^&*()_+~=]/g);
                    if (regexSpecial.test(ch)) {
                        formatPassword.value.special = true;
                    }
                }
                if (passwordValue.value.length >= 8) formatPassword.value.min = true;
            }
            return formatPassword.value;
        });
        const showSuccessPass = computed(() => Object.values(checkFormatPassword.value).every(val => val));
        const checkConfirmPassword = computed(() => {
            if (passwordValue.value && confirmPassword.value) {
                if (showSuccessPass.value || countValidatePassword.value > 0) {
                    // eslint-disable-next-line
                    countValidatePassword.value = 1;
                    return passwordValue.value !== confirmPassword.value;
                }
            }
            // eslint-disable-next-line
            countValidatePassword.value = 0;
            return false;
        });
        const checkError = computed(() => {
            return (val: any) => listError.value.indexOf(val) > -1;
        });

        const addBasic = () => {
            addToast({
                title: t('slp.change_password_toast_success'),
                type: 'basic',
                timeout: 4000,
            });
        };
        const onSubmit = async () => {
            listError.value = [];
            isError.value = false;
            const response = await updatePassword({
                current_password: currentPassword.value,
                new_password: passwordValue.value,
            });
            if (response.error) {
                Object.keys(response.message).forEach(e => listError.value.push(e));
            } else {
                addBasic();
                context.emit('clicked');
            }
        };
        const clickCancel = async () => {
            context.emit('clicked');
        };

        watch(showSuccessPass, newVal => {
            if (!newVal) {
                const indexError = listError.value.indexOf('new_password_must_be_different_from_current_password');
                if (indexError > -1) listError.value.splice(indexError, 1);
            }
        });

        return {
            errorMessage,
            loading,
            isError,
            checkFormatPassword,
            passwordValue,
            confirmPassword,
            currentPassword,
            showSuccessPass,
            checkConfirmPassword,
            checkError,
            t,
            onSubmit,
            clickCancel,
            errorListMessage,
        };
    },
});
</script>

<style lang="scss" scoped>
// @import url('/src/assets/styles/partials/_input.scss');
// @import url('/src/assets/styles/partials/_button.scss');
.model-change-password {
    z-index: 1;
}
.change-password {
    width: 100%;
    .verify-account {
        width: 236px;
        height: 100px;
        object-fit: contain;
    }
    .img-error {
        width: 100px;
        height: 100px;
        object-fit: contain;
    }
    .text-error-3 {
        font-size: 14px;
    }
}
.change-password::v-deep .cursor-pointer {
    color: #141417;
}
// .btn-bottom {
//     .button--auth {
//         height: 36px;
//         padding: 9px 10px;
//         border-radius: 3px;
//         font-size: 14px;
//     }
//     .btn-cancel {
//         color: #141417;
//         background-color: #f6f6f8;
//         border: 1px solid #ddddddd4;
//     }
// }
// .input--auth {
//     height: 36px;
//     border-radius: 5px;
//     border-color: #b4b4be;
//     box-shadow: none;
//     input {
//         font-size: 14px;
//     }
// }
// .input--auth.ring-error {
//     border-color: #ec2b08;
// }
</style>
