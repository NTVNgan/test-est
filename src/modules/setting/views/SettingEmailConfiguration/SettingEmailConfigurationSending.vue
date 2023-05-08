<template>
    <div class="email-configuration__sending pt-40p max-w-620 m-auto" v-if="isLoading">
        <span class="block text-16 font-medium mb-4p">{{ $t('setting.email_configuration_sending_title') }}</span>
        <p class="text-14 text-neutrals-500" v-html="$t('setting.email_configuration_sending_decription')" />
        <div class="email-configuration__sending-default">
            <Radio :valueRadio="1" v-model="infoSending.valueDefaultEmail" nameRadio="defaultEmail">
                <template v-slot:label>{{ $t('setting.email_configuration_sending_work_email_title') }}</template>
                <template v-slot:decription>
                    <p
                        class="text-14 text-neutrals-500 mt-4p"
                        v-html="
                            $t('setting.email_configuration_sending_work_email_decription', { wordEmail: wordEmail })
                        "
                    ></p>
                </template>
            </Radio>
            <Radio disabledRadio :valueRadio="2" v-model="infoSending.valueDefaultEmail" nameRadio="defaultEmail">
                <template v-slot:label>
                    <span class="block text-14 text-neutrals-300">{{
                        $t('setting.email_configuration_sending_registered_email_title')
                    }}</span>
                </template>
                <template v-slot:decription>
                    <p
                        class="text-14 text-neutrals-200 mt-4p"
                        v-html="
                            $t('setting.email_configuration_sending_registered_email_decription', {
                                registeredEmail: registeredEmail,
                            })
                        "
                    />
                </template>
            </Radio>
        </div>
        <span class="block text-16 font-medium mb-12p mt-40p">{{
            $t('setting.email_configuration_sending_email_offline_title')
        }}</span>
        <div class="email-configuration__sending-offline">
            <Radio :valueRadio="0" v-model="infoSending.valueOfflineEmail" nameRadio="offlineEmail">
                <template v-slot:label>{{ $t('setting.email_configuration_sending_email_offline_option1') }}</template>
            </Radio>
            <Radio :valueRadio="1" v-model="infoSending.valueOfflineEmail" nameRadio="offlineEmail">
                <template v-slot:label>{{ $t('setting.email_configuration_sending_email_offline_option2') }}</template>
                <template v-slot:custom>
                    <span
                        class="text-14 text-neutrals-500 block mt-4p"
                        v-html="$t('setting.email_configuration_sending_email_offline_option2_decription')"
                    />
                    <div class="flex items-center text-14">
                        <Input
                            type="number"
                            v-model="infoSending.valueEmailLimit"
                            :disabledUp="disabledArrowUp"
                            :disabledDown="disabledArrowDown"
                            :stepper="true"
                            class="mr-8p email-configuration__sending-offline-input"
                            :state="
                                parseInt(infoSending.valueEmailLimit) > 10 ||
                                parseInt(infoSending.valueEmailLimit) < 1 ||
                                maximumEmail
                                    ? 'error'
                                    : ''
                            "
                            @keydown="handleKeydown"
                        />
                        email(s)
                    </div>
                    <span
                        class="text-error-3 text-14 mt-4p"
                        v-if="parseInt(infoSending.valueEmailLimit) > 10 || maximumEmail"
                        >{{ $t('setting.email_configuration_sending_email_offline_option2_error_limit') }}</span
                    >
                    <span class="text-error-3 text-14 mt-4p" v-if="parseInt(infoSending.valueEmailLimit) < 1">
                        Must be at least 1 email.
                    </span>
                </template>
            </Radio>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, inject } from 'vue';
import Radio from '@/components/ui/RadioButtonComponent.vue';
import Input from '@/components/ui/InputComponent.vue';

interface InfoSending {
    valueDefaultEmail?: number;
    valueOfflineEmail?: number;
    valueEmailLimit?: any;
}

export default defineComponent({
    name: 'Email Configuration Sending',
    components: {
        Radio,
        Input,
    },
    props: {
        isLoading: {
            type: Boolean,
            default: false,
        },
        dataSending: {
            type: null,
        },
        store: {
            type: null,
        },
    },
    setup(props, { emit }) {
        const wordEmail = ref<string>('');
        const registeredEmail = ref<string>('');
        const disabledArrowUp = ref<boolean>(false);
        const disabledArrowDown = ref<boolean>(false);
        const infoSending = ref<InfoSending>({
            valueDefaultEmail: 1,
            valueOfflineEmail: 0,
            valueEmailLimit: '10',
        });
        const infoSendingClone = ref<InfoSending>({
            valueDefaultEmail: 1,
            valueOfflineEmail: 0,
            valueEmailLimit: '10',
        });
        const emitter: any = inject('emitter');
        const maximumEmail = ref<boolean>(false);

        const getDataSending = () => {
            if (Object.keys(props.dataSending).length !== 0) {
                wordEmail.value = props.store.email_sending_address;
                registeredEmail.value = props.store.email;
                infoSending.value = {
                    valueDefaultEmail: props.dataSending.email_sending_type,
                    valueOfflineEmail: props.dataSending.email_sending_alert_active,
                    valueEmailLimit: props.dataSending.email_sending_alert_limit.toString(),
                };
                infoSendingClone.value = JSON.parse(JSON.stringify(infoSending.value));
            }
        };

        const handleKeydown = (e: any) => {
            const invalidChars = ['+', 'e'];
            if (invalidChars.includes(e.key)) e.preventDefault();
        };

        emitter.on('resetDefaultData', async (data: any) => {
            infoSending.value = JSON.parse(JSON.stringify(infoSendingClone.value));
        });

        watch(
            () => infoSending.value.valueEmailLimit,
            (newVal: any) => {
                if (newVal) {
                    const numberLimit = parseInt(newVal);
                    if (numberLimit <= 0) {
                        disabledArrowDown.value = true;
                        disabledArrowUp.value = false;
                        emit('disableButtonSaveSending', true);
                    } else if (numberLimit >= 10) {
                        disabledArrowUp.value = true;
                        disabledArrowDown.value = false;
                        if (numberLimit > 10) emit('disableButtonSaveSending', true);
                        else emit('disableButtonSaveSending', false);
                    } else if (1 <= numberLimit && numberLimit < 10) {
                        if (numberLimit == 1) disabledArrowDown.value = true;
                        else disabledArrowDown.value = false;
                        disabledArrowUp.value = false;
                        emit('disableButtonSaveSending', false);
                    }
                } else {
                    emit('disableButtonSaveSending', true);
                }
            },
        );

        watch(
            infoSending,
            () => {
                const dataChange = JSON.stringify(infoSending.value) !== JSON.stringify(infoSendingClone.value);
                const dataSending = {
                    email_sending_type: infoSending.value.valueDefaultEmail,
                    email_sending_alert_active: infoSending.value.valueOfflineEmail,
                    email_sending_alert_limit: parseInt(infoSending.value.valueEmailLimit),
                };
                emit('changeSendingEmit', {
                    sending: dataChange,
                    data: dataSending,
                });
            },
            { deep: true },
        );

        watch(
            () => props.dataSending,
            () => {
                infoSendingClone.value = JSON.parse(JSON.stringify(infoSending.value));
            },
            { deep: true },
        );

        watch(
            () => infoSending.value.valueOfflineEmail,
            () => {
                infoSending.value.valueEmailLimit = infoSendingClone.value.valueEmailLimit;
            },
        );

        onMounted(async () => {
            getDataSending();
            const numberLimit = infoSending.value.valueEmailLimit;
            if (numberLimit <= 1) disabledArrowDown.value = true;
            else if (numberLimit >= 10) disabledArrowUp.value = true;
            else if (1 < numberLimit && numberLimit < 10) {
                disabledArrowDown.value = false;
                disabledArrowUp.value = false;
            }
        });

        return {
            wordEmail,
            registeredEmail,
            disabledArrowUp,
            disabledArrowDown,
            infoSending,
            infoSendingClone,
            handleKeydown,
            maximumEmail,
        };
    },
});
</script>

<style lang="scss">
.email-configuration__sending {
    .radio-component {
        margin-top: 12px;
    }
    &-offline {
        &-input {
            width: 144px;
        }
    }
}
</style>
