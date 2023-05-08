<template>
    <div
        class="email-configuration__receiving overflow-y-auto scrollbar--transparent h-full pt-40p"
        ref="scrollWrapper"
        v-if="isLoading"
    >
        <div class="max-w-620 m-auto">
            <p class="text-14 text-primary-500">{{ $t('setting.email_configuration_receiving_link') }}</p>
            <div class="mt-8p mb-40p">
                <span class="block text-16 font-medium">{{
                    $t('setting.email_configuration_receiving_title_email_default')
                }}</span>
                <div class="flex my-8p email-configuration__receiving-input-email">
                    <Input class="flex-grow text-neutrals-600 text-14" disabled v-model="emailAddress">
                        <template v-slot:prefix>
                            <icon-comp name="envelope" color="neutrals-500"></icon-comp>
                        </template>
                    </Input>
                    <tooltip-component position="top" :content="'Copied'" showByClick class="tooltip-btn ml-16p">
                        <button-component size="medium" class="btn-copy" @click="helper.copyToClipboard(emailAddress)">
                            <icon-comp class="mr-4p" name="clone" color="white"></icon-comp> Copy</button-component
                        >
                    </tooltip-component>
                </div>
                <span
                    class="text-14 text-neutrals-500"
                    v-html="$t('setting.email_configuration_receiving_decription_email_default')"
                ></span>
            </div>
            <span class="block text-16 font-medium">{{
                $t('setting.email_configuration_receiving_title_email_ignore')
            }}</span>
            <span class="block text-14 text-neutrals-500 mt-4p mb-12p">{{
                $t('setting.email_configuration_receiving_decription_email_ignore')
            }}</span>
            <div class="">
                <template v-for="(item, index) in formData" :key="`email-${index}`">
                    <div class="input__select flex" :class="{ 'mt-12p': index > 0 }">
                        <Input
                            :state="item.error && item.error !== 'email_required' ? 'error' : 'primary'"
                            v-model.trim="item.email"
                            class="flex-1"
                            placeholder="e.g. team@company-email.com"
                            :ref="
                                el => {
                                    if (el) divs[index] = el;
                                }
                            "
                        >
                        </Input>
                        <button-component
                            v-if="formData.length > 1"
                            class="input__select--remove ml-4p mt-3p"
                            icon="times"
                            type="subtle"
                            @click="removeEmailTeammate(index)"
                        ></button-component>
                    </div>
                    <div
                        v-if="item.error && item.error !== 'email_required'"
                        class="break-words text-14 text-error-3 mt-4p"
                    >
                        {{ $t(`setting.invite_teammate_error_${item.error}`) }}
                    </div>
                </template>
                <div class="mt-12p">
                    <template v-if="formData.length < 100">
                        <button-component
                            type="subtle"
                            @click="addMoreEmailTeammate"
                            :disabled="formData.length === 100"
                        >
                            <icon-comp name="plus" class="mr-4p" />
                            <span class="text-14">{{ $t('setting.teammate_modal_invite_button_add_more') }}</span>
                        </button-component>
                    </template>
                    <template v-else>
                        <Alert :type="'warning'" class="mt-12p" :close="false" nameIcon="exclamation-circle">
                            <template v-slot:message>
                                <div class="text-14 my-2p">
                                    {{ $t('setting.email_configuration_receiving_email_ignore_limit') }}
                                </div>
                            </template>
                        </Alert>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, computed, onMounted, watch, inject, onBeforeUpdate } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';
import helper from '@/utils/helper';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { store } from '@/store';
import { validateEmail } from '@/utils/validate';

export default defineComponent({
    name: 'Email Configuration Receiving',
    components: {
        Input,
        IconComp,
        ButtonComponent,
        Alert,
        TooltipComponent,
    },
    props: {
        dataReceiving: {
            type: null,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const emailAddress = ref<string>('firegroup_linebase@linebase.com');
        const scrollWrapper = ref<HTMLElement>();
        const divs = ref<any>([]);

        const formData = ref<EmailIgnore[]>([
            {
                email: '',
                error: 'email_required',
            },
        ]);
        const emailListGet = ref<any[]>([]);
        const emitter: any = inject('emitter');

        const emailListConvert = () => {
            let newUsers = [];
            if (emailListGet.value.length == 0) {
                newUsers = [
                    {
                        email: '',
                        error: 'email_required',
                    },
                ];
            } else {
                newUsers = emailListGet.value.map((item: any) => ({
                    email: item,
                    error: 'email_required',
                }));
            }
            formData.value = newUsers;
        };

        const emailList = computed(() => {
            return formData.value.map((item: any) => item.email);
        });

        const addMoreEmailTeammate = async () => {
            formData.value.push({
                email: '',
                error: 'email_required',
            });
            await nextTick();
            if (scrollWrapper.value) {
                scrollWrapper.value.scrollTop = scrollWrapper.value.scrollHeight;
            }
            const indexLastFormData = formData.value.length - 1;
            divs.value[indexLastFormData].textfieldComp.focus();
        };

        const removeEmailTeammate = async (index: number) => {
            formData.value.splice(index, 1);
            await nextTick();
            if (scrollWrapper.value) {
                scrollWrapper.value.focus();
            }
        };

        const setErrorEmail = (index: any, errorValue: string) => {
            formData.value[index].error = errorValue;
        };

        const invalidEmailList = computed(() => {
            const invalidList = [];
            for (let index = 0; index < formData.value.length; index++) {
                const item = formData.value[index];
                if (item.email !== '' && !validateEmail(item.email)) {
                    invalidList.push(item.email);
                }
            }
            return invalidList;
        });

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const checkDisableButton = computed(() => {
            return formData.value.some((item: any) => item.error !== '');
        });

        const getDataReceiving = () => {
            if (Object.keys(props.dataReceiving).length !== 0) {
                emailAddress.value = props.dataReceiving.email_app_address;
                emailListGet.value = props.dataReceiving.email_incoming_ignore
                    ? props.dataReceiving.email_incoming_ignore
                    : [];
            }
        };

        emitter.on('resetDefaultData', async (data: any) => {
            await emailListConvert();
        });

        watch(
            () => props.dataReceiving,
            (newVal: any) => {
                if (newVal) {
                    emailListGet.value = newVal.email_incoming_ignore;
                }
            },
            { deep: true },
        );

        watch(
            () => emailList.value,
            (newVal: any) => {
                for (let index = 0; index < newVal.length; index++) {
                    const item = newVal[index];
                    const beforeItems: any = emailList.value.slice(0, index);
                    if (item !== '' && beforeItems.includes(item) && !invalidEmailList.value.includes(item)) {
                        setErrorEmail(index, 'email_exists');
                        emit('disableButtonSaveReceiving', true);
                    } else if (item === '') {
                        setErrorEmail(index, 'email_required');
                        // emit('disableButtonSaveReceiving', true);
                    } else if (invalidEmailList.value.includes(item)) {
                        setErrorEmail(index, 'email_format_invalid');
                        emit('disableButtonSaveReceiving', true);
                    } else {
                        setErrorEmail(index, '');
                        emit('disableButtonSaveReceiving', false);
                    }
                }
                if (emailList.value.length == 1 && emailList.value[0] == '' && emailListGet.value.length !== 0) {
                    emit('changeReceivingEmit', {
                        receiving: true,
                        data: emailList.value,
                    });
                } else {
                    const difference = JSON.stringify(emailList.value) !== JSON.stringify(emailListGet.value);
                    emit('changeReceivingEmit', {
                        receiving: difference && !checkDisableButton.value,
                        data: emailList.value,
                    });
                }
            },
            { deep: true },
        );

        onMounted(async () => {
            getDataReceiving();
            await emailListConvert();
        });

        // onBeforeUpdate(() => {
        //     divs.value = [];
        // });

        return {
            emailAddress,
            formData,
            addMoreEmailTeammate,
            scrollWrapper,
            removeEmailTeammate,
            helper,
            userStore,
            emailList,
            emailListConvert,
            checkDisableButton,
            emailListGet,
            divs,
        };
    },
});
</script>

<style lang="scss">
.email-configuration__receiving {
    .btn-copy {
        width: 84px;
        padding-left: 12px;
    }
    .input__select {
        &--remove {
            display: none;
        }
        &:hover,
        &:focus-within {
            .input__select--remove {
                display: flex;
            }
        }
    }
    &-input-email {
        .placeholder-neutrals-300 {
            color: #555562;
            font-size: 14px;
            line-height: 20px;
        }
    }
}
</style>
