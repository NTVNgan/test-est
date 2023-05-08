<template>
    <div class="py-24p px-40p profile-account h-full overflow-y-auto scrollbar--transparent relative">
        <template v-if="isShowProfile">
            <h2 class="text-24 text-neutrals-900 font-semibold">{{ $t('slp.profile_title_page') }}</h2>
            <form class="profile-account__form">
                <div class="profile-account__form-avatar">
                    <div class="avatar m-auto relative">
                        <div class="avatar-img border-2 border-solid border-avatar-1 rounded-50%">
                            <template v-if="imageSingleRes">
                                <img :src="checkBase64" class="w-full h-full object-cover object-center" />
                            </template>
                            <template v-else>
                                <img
                                    src="../images/avatar-default.png"
                                    class="w-full h-full object-cover object-center"
                                />
                            </template>
                        </div>
                        <div
                            class="
                                avatar-btn-upload
                                cursor-pointer
                                w-32
                                h-32
                                bg-primary-500
                                flex
                                items-center
                                justify-center
                                rounded-50%
                                absolute
                            "
                            @click="() => (defaultType = !defaultType)"
                        >
                            <icon-component name="camera" color="white" />
                        </div>
                    </div>
                </div>
                <p class="text-24 text-primary-500 font-semibold text-center mt-24p mb-32p truncate">
                    {{ infoUser.usernameValue.trim() }}
                </p>
                <div class="profile-account__form-username">
                    <label for="username" class="block text-14 text-neutrals-900 font-medium">{{
                        $t('slp.profile_title_username')
                    }}</label>
                    <div class="mt-4p">
                        <Input
                            :state="v$.infoUser.usernameValue.validateUsername.$response ? 'error' : 'primary'"
                            id="username"
                            v-model="infoUser.usernameValue"
                            type="text"
                            :maxlength="100"
                            v-on:keydown.enter="saveProfile"
                        />
                        <span
                            v-if="v$.infoUser.usernameValue.validateUsername.$response"
                            class="inline-block text-error-3 mt-8p"
                            >{{ $t('slp.profile_error_username_min') }}</span
                        >
                    </div>
                </div>
                <div class="pt-16p profile-account__form-email">
                    <label for="email" class="block text-14 text-neutrals-900 font-medium">Registered Email</label>
                    <div class="mt-4p">
                        <Input
                            :state="
                                (infoUser.emailValue && !v$.infoUser.emailValue.validateEmail.$response) ||
                                isErrorEmailExist
                                    ? 'error'
                                    : 'primary'
                            "
                            id="email"
                            v-model="infoUser.emailValue"
                            v-on:keydown.enter="saveProfile"
                        />
                        <span
                            v-if="infoUser.emailValue && !v$.infoUser.emailValue.validateEmail.$response"
                            class="inline-block text-error-3 mt-4p text-14"
                            >{{ $t('common.error_invalid_email_format') }}</span
                        >
                        <span v-if="isErrorEmailExist" class="inline-block text-error-3 mt-4p text-14">
                            Email already exists, please try another one.
                        </span>
                    </div>
                </div>
                <div class="py-16p profile-account__form-email-work">
                    <label for="email-work" class="block text-14 text-neutrals-900 font-medium"
                        >LineBase work Email</label
                    >
                    <div class="mt-4p">
                        <Tooltip
                            type="light"
                            position="top"
                            :content="userStore.email_sending_address"
                            label="Tooltip"
                            maxWidthContent="max-w-428"
                        >
                            <template #content>
                                <div class="flex items-center">
                                    <span>{{ userStore.email_sending_address }}</span>
                                    <Tooltip
                                        class="inline-block ml-8p"
                                        type="dark"
                                        position="top"
                                        content="Copied"
                                        label="Tooltip"
                                        showByClick
                                    >
                                        <IconComponent
                                            name="copy"
                                            class="cursor-pointer icon-copy"
                                            color="neutrals-500 hover:text-primary-500"
                                            @click="helper.copyToClipboard(userStore.email_sending_address)"
                                        />
                                    </Tooltip>
                                </div>
                            </template>
                            <Input
                                type="text"
                                class="w-full truncate"
                                id="email-work"
                                v-model="userStore.email_sending_address"
                                disabled="disabled"
                            />
                        </Tooltip>
                    </div>
                </div>
                <div class="profile-account__form-password">
                    <label for="password" class="block text-14 text-neutrals-900 font-medium">Password</label>
                    <div class="mt-4p flex items-center">
                        <Input
                            type="password"
                            class="w-full"
                            id="password"
                            v-model="infoUser.passwordValue"
                            disabled="disabled"
                        />
                        <button-component size="medium" type="outline" class="ml-8p w-80" @click="toggleModal">
                            <span>Change</span>
                        </button-component>
                    </div>
                </div>
                <button-group class="profile-account__form-button mt-48p justify-end">
                    <button-component
                        class="px-18p"
                        :class="{ 'btn-cancel': !disableButtonCancel }"
                        size="small"
                        type="secondary"
                        :disabled="disableButtonCancel"
                        @click="resetDefault"
                    >
                        <span class="text-neutrals-300">Cancel</span>
                    </button-component>
                    <button-component
                        class="ml-4p px-18p"
                        size="small"
                        type="primary"
                        :disabled="disableButtonSave"
                        @click="saveProfile"
                    >
                        <span>Save</span>
                    </button-component>
                </button-group>
            </form>
            <modal-component
                v-model="defaultType"
                class="profile-account__upload"
                width="640px"
                @close="errorImage = false"
            >
                <template v-slot:header>
                    <span class="font-medium text-16">Change your avatar</span>
                </template>
                <template v-slot:body class="test">
                    <drop-zone
                        v-model="imageSingle"
                        name="handleSingle"
                        id="single"
                        @onChange="changeImage"
                        :error="errorImage"
                        @closeAlert="errorImage = false"
                    >
                        <template v-slot:messageError>
                            <p>{{ messageError }}</p>
                        </template>
                        <template v-slot:image>
                            <icon-component :name="'CloudDownloadAlt'" color="neutrals-500" />
                        </template>
                        <template v-slot:button>
                            <span
                                class="
                                    font-medium
                                    text-14 text-neutrals-900
                                    shadow-innner-button-add
                                    rounded
                                    py-8p
                                    px-16p
                                    block
                                "
                                >Upload photo</span
                            >
                        </template>
                        <template v-slot:text>
                            <span class="text-14 text-neutrals-500 font-medium block mb-8p"
                                >or drag & drop it here.</span
                            >
                            <span class="block text-12 text-neutrals-500"
                                >Only JPG, PNG or JPEG file with max size of 10MB.</span
                            >
                        </template>
                    </drop-zone>
                </template>
                <template v-slot:footer>
                    <div class="flex justify-end">
                        <button-component
                            type="outline"
                            class="mr-8p btn-cancel"
                            size="medium"
                            @click="
                                defaultType = false;
                                imageSingle = '';
                                errorImage = false;
                            "
                            >Cancel</button-component
                        >
                        <button-component
                            type="primary"
                            size="medium"
                            @click="saveAvatar"
                            :disabled="imageSingle ? false : true"
                        >
                            <template v-if="!loading">Save</template>
                            <template v-else>
                                <svg
                                    class="profile-account__loader"
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
                        </button-component>
                    </div>
                </template>
            </modal-component>
            <div class="p-10p">
                <change-password :key="key" v-model="showChangePassword" @clicked="toggleModal"></change-password>
            </div>
        </template>
        <template v-else>
            <LoadingScreen />
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ButtonGroup from '@/components/ui/ButtonGroupComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import DropZone from '@/components/ui/DropzoneComponent.vue';
import useVuelidate from '@vuelidate/core';
import { validateEmail } from '@/utils/validate';
import { maxLength, minLength, required } from '@vuelidate/validators';
import { store } from '@/store';
import { useUser } from '@/modules/auth/composables/useUser';
import { useProfile } from '../composables/useProfile';
import ChangePassword from '@/modules/profile/components/ChangePassword.vue';
import LoadingScreen from '@/modules/auth/components/AuthLoadingScreen.vue';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import helper from '@/utils/helper';

interface FileItem {
    type?: string;
    size: number;
}
interface InfoUser {
    imageSingleRes?: string;
    usernameValue?: string;
    emailValue?: string;
    passwordValue?: string;
}
const validateUsername = (val: any) => {
    const nameLength = val.trim().length;
    if (nameLength === 0 || nameLength < 3 || nameLength > 100) {
        return true;
    } else return false;
};
export default defineComponent({
    name: 'AccountDetail',
    validations() {
        return {
            infoUser: {
                emailValue: { validateEmail },
                usernameValue: {
                    validateUsername,
                },
            },
        };
    },
    components: {
        Input,
        ButtonComponent,
        ButtonGroup,
        IconComponent,
        ModalComponent,
        DropZone,
        ChangePassword,
        LoadingScreen,
        Tooltip,
    },
    setup() {
        /*   Data  */
        const v$ = useVuelidate();
        const { _id: userId } = store.state.auth.user,
            defaultType = ref<boolean>(false),
            imageSingle = ref<any>(''),
            imageSingleRes = ref<any>(''),
            errorImage = ref<boolean>(false),
            messageError = ref<string>(''),
            disableButtonSave = ref<boolean>(true),
            disableButtonCancel = ref<boolean>(true),
            { updateUser, getUserById } = useUser(),
            { updateAvatarByID } = useProfile(),
            showChangePassword = ref<boolean>(false),
            key = ref<number>(0),
            fileImage = ref<any>(),
            loading = ref<boolean>(false),
            isShowProfile = ref<boolean>(false),
            isErrorEmailExist = ref<boolean>(false);
        const { addToast } = useToast();
        const { t } = useI18n();

        const infoUser = ref<InfoUser>({
            usernameValue: '',
            emailValue: '',
            passwordValue: '123456',
        });
        const infoUserDefault = ref<InfoUser>({
            usernameValue: '',
            emailValue: '',
            passwordValue: '123456',
        });

        /*   Method   */

        const changeImage = (info: any) => {
            const isJpgOrPng = info.type === 'image/jpeg' || info.type === 'image/png' || info.type === 'image/jpg';
            const isLt2M = info.size / 1024 / 1024 < 10;
            if (!isJpgOrPng) {
                messageError.value = 'Failed to upload photo. Please only upload JPG,PNG or JPEG type.';
                errorImage.value = true;
                return;
            }

            if (!isLt2M) {
                messageError.value = 'Failed to upload photo. Maximum file limit is 10MB.';
                errorImage.value = true;
                return;
            }

            errorImage.value = false;
            fileImage.value = info;
            const reader = new FileReader();
            reader.onload = async (e) => {
                imageSingle.value = e.target?.result;
            };
            reader.readAsDataURL(info as any);
        };

        const saveAvatar = async () => {
            const data = new FormData();
            const file = fileImage.value;

            data.append('avatar', file);
            loading.value = true;
            try {
                const avatar = await updateAvatarByID(userId, data);
                if (avatar) {
                    loading.value = false;
                    imageSingleRes.value = imageSingle.value;
                    store.state.auth.user.avatar_src = avatar.avatar_src;
                    imageSingle.value = '';
                    defaultType.value = false;
                }
            } catch (e) {
                loading.value = false;
            }
        };

        const saveProfile = async () => {
            const valEmail = JSON.parse(JSON.stringify(v$.value.infoUser)).emailValue.$invalid;
            const valUser = JSON.parse(JSON.stringify(v$.value.infoUser)).usernameValue.$invalid;
            if (infoUser.value.usernameValue && valUser && infoUser.value.emailValue && !valEmail) {
                try {
                    // const avatarData = await updateAvatarByID(storeUser.value._id, imageSingle.value);
                    const profileData: User = await updateUser({
                        username: infoUser.value.usernameValue.trim(),
                        full_name: infoUser.value.usernameValue.trim(),
                        email: infoUser.value.emailValue,
                    });
                    if (profileData) {
                        // profileData && store.commit('auth/UPDATE_USER_AUTH', profileData);
                        store.state.auth.user.username = profileData.username;
                        infoUserDefault.value = JSON.parse(JSON.stringify(infoUser.value));
                        disableButtonCancel.value = true;
                        disableButtonSave.value = true;
                        addToast({
                            title: t('slp.profile_toast_update_success'),
                            type: 'basic',
                            single: true,
                            timeout: 3000,
                        });
                    }
                } catch (e) {
                    console.log({ e });
                    if (e.email_is_exist) {
                        isErrorEmailExist.value = true;
                    }
                }
            }
        };

        const resetDefault = () => {
            infoUser.value = JSON.parse(JSON.stringify(infoUserDefault.value));
        };

        const toggleModal = () => {
            key.value++;
            showChangePassword.value = !showChangePassword.value;
        };

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        /* onmouted  */
        onMounted(async () => {
            const info: User = await getUserById(userId);
            if (info) {
                isShowProfile.value = true;
                infoUser.value = {
                    // imageSingleRes: info.avatar,
                    usernameValue: info.username,
                    emailValue: info.email,
                    passwordValue: '123456',
                };
                imageSingleRes.value = info.avatar_src;
                infoUserDefault.value = JSON.parse(JSON.stringify(infoUser.value));
            }
        });

        /* computed */
        const checkBase64 = computed(() => {
            if (imageSingleRes.value) {
                if (imageSingleRes.value.includes('base64')) {
                    return imageSingleRes.value;
                } else {
                    return process.env.VUE_APP_FILE_URL + '/' + imageSingleRes.value;
                }
            }
            return '';
        });

        const isInvalidName = computed(() => {
            const nameLength = infoUser.value.usernameValue?.trim().length;
            if (!nameLength || nameLength < 3 || nameLength > 100) {
                return true;
            }
            return false;
        });

        const isInvalidEmail = computed(() => {
            return validateEmail(infoUser.value.emailValue);
        });

        /*  watch  */
        watch(
            infoUser,
            () => {
                disableButtonSave.value =
                    isInvalidName.value ||
                    !isInvalidEmail.value ||
                    !(JSON.stringify(infoUser.value) !== JSON.stringify(infoUserDefault.value));
                disableButtonCancel.value = !(JSON.stringify(infoUser.value) !== JSON.stringify(infoUserDefault.value));
            },
            { deep: true },
        );

        watch(
            () => infoUser.value.emailValue,
            () => {
                isErrorEmailExist.value = false;
            },
        );

        return {
            v$,
            loading,
            infoUser,
            defaultType,
            imageSingle,
            imageSingleRes,
            errorImage,
            messageError,
            disableButtonCancel,
            disableButtonSave,
            changeImage,
            infoUserDefault,
            saveProfile,
            resetDefault,
            showChangePassword,
            toggleModal,
            key,
            fileImage,
            saveAvatar,
            checkBase64,
            isInvalidName,
            isInvalidEmail,
            isShowProfile,
            isErrorEmailExist,
            userStore,
            helper,
        };
    },
});
</script>

<style lang="scss">
.profile-account {
    &__form {
        max-width: 432px;
        width: 100%;
        margin: 48px auto 0;
        &-avatar {
            background-image: url('../images/bg-avatar.png');
            background-size: contain;
            background-repeat: no-repeat;
            max-width: 233px;
            margin: 0 auto;
            padding-top: 27px;
            .avatar {
                width: 138px;
                height: 138px;
                &-img {
                    padding: 5px;
                    img {
                        border-radius: 50%;
                        height: 124px;
                    }
                }
                &-btn-upload {
                    bottom: 5px;
                    right: 7px;
                }
            }
        }
        .input__suffix-password {
            display: none;
        }
        &-password {
            .relative.w-fill.pl-12p.pr-12p {
                padding: 0;
                input {
                    padding: 8px 12px;
                }
            }
        }
        &-button {
            .btn-cancel {
                span {
                    color: #141417;
                }
            }
        }
        &-email {
            &-work {
                #email-work {
                    input {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
    &__upload {
        z-index: 1;
        .btn-cancel {
            background-color: transparent;
            border: 1px solid #e9e9ec;
        }
        .modal-body {
            padding: 24px 32px;
        }
        .dropzone-component {
            &-content {
                min-height: 200px;
                .list-file__item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 200px;
                    height: 200px;
                    margin: 0 auto;
                    height: 100%;
                    img {
                        height: 200px;
                        width: 100%;
                        object-fit: contain;
                    }
                }
            }
        }
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
