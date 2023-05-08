<template>
    <div class="email-configuration">
        <template v-if="isLoading">
            <div class="flex items-center justify-between py-22p px-40p">
                <span class="font-heading text-24 font-semibold capitalize">{{
                    $t('setting.email_configuration_title')
                }}</span>
                <div class="flex">
                    <button-component
                        type="outline"
                        :disabled="!checkDisableButton"
                        size="medium"
                        @click="cancelEmailConfiguration"
                    >
                        Cancel
                    </button-component>
                    <button-component
                        class="ml-8p"
                        :disabled="!checkDisableButton || checkDisableButtonSave"
                        size="medium"
                        @click="saveEmailConfiguration"
                    >
                        Save
                    </button-component>
                </div>
            </div>
            <tab-component
                class="email-configuration__tab"
                v-model="tab"
                :tabs="tabs"
                default-value="active"
                type="underline"
            >
                <div id="receiving" class="h-full">
                    <Receiving
                        @changeReceivingEmit="checkChangeReceiving"
                        :dataReceiving="dataSetting"
                        :isLoading="isLoading"
                        @disableButtonSaveReceiving="checkDisableButtonSaveReceiving"
                    />
                </div>
                <div id="sending">
                    <Sending
                        @changeSendingEmit="checkChangeSending"
                        :isLoading="isLoading"
                        :dataSending="dataSetting"
                        :store="userStore"
                        @disableButtonSaveSending="checkDisableButtonSaveSending"
                    />
                </div>
            </tab-component>
        </template>
        <template v-else>
            <LoadingScreen />
        </template>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, onMounted, inject } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import TabComponent from '@/components/ui/TabComponent.vue';
import Receiving from './SettingEmailConfigurationReceiving.vue';
import Sending from './SettingEmailConfigurationSending.vue';
import { useEmailConfig } from '@/modules/setting/composables/useEmailConfiguration';
import { store } from '@/store';
import LoadingScreen from '@/modules/auth/components/AuthLoadingScreen.vue';
import { useToast } from '@/composables/useToast';
import { onBeforeRouteLeave } from 'vue-router';

export default defineComponent({
    name: 'Email Configution',
    components: {
        ButtonComponent,
        TabComponent,
        Receiving,
        Sending,
        LoadingScreen,
    },
    setup() {
        const tab = ref<string>('receiving');
        const tabs = ref<any>([
            { key: 'receiving', name: 'Receiving' },
            { key: 'sending', name: 'Sending' },
        ]);
        const changeReceiving = ref<boolean>(false);
        const changeSending = ref<boolean>(false);
        const disableButtonSaveReceiving = ref<boolean>(false);
        const disableButtonSaveSending = ref<boolean>(false);
        const { saveReceiving, getReceiving, saveSending, dataEmail } = useEmailConfig();
        const emailIgnore = ref<any>([]);
        const dataSetting = ref<any>({});
        const isLoading = ref<boolean>(false);
        const dataSendingEmail = ref<any>(null);
        const { addToast } = useToast();
        const emitter: any = inject('emitter');

        const checkChangeReceiving = (data: any) => {
            changeReceiving.value = data.receiving;
            emailIgnore.value = data.data;
        };

        const checkChangeSending = (data: any) => {
            changeSending.value = data.sending;
            dataSendingEmail.value = data.data;
        };

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const checkDisableButton = computed(() => {
            if (changeReceiving.value || changeSending.value) return true;
            else return false;
        });

        const saveEmailConfiguration = async () => {
            if (changeReceiving.value && !changeSending.value) {
                let listEmailIgnore: any[] = [];
                if (emailIgnore.value.length == 1 && emailIgnore.value[0] == '') listEmailIgnore = [];
                else listEmailIgnore = emailIgnore.value;
                const data = await saveReceiving(
                    userStore.value.workspace_id,
                    { email_incoming_ignore: listEmailIgnore },
                    '',
                );
                try {
                    dataSetting.value = data.setting;
                    changeReceiving.value = false;
                    addToast({
                        title: 'Setting changed successfully',
                        type: 'basic',
                        timeout: 3000,
                    });
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                }
            }
            if (!changeReceiving.value && changeSending.value) {
                const data = await saveSending(userStore.value.workspace_id, dataSendingEmail.value);
                try {
                    dataSetting.value = data.setting;
                    changeSending.value = false;
                    addToast({
                        title: 'Setting changed successfully',
                        type: 'basic',
                        timeout: 3000,
                    });
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                }
            }
            if (changeReceiving.value && changeSending.value) {
                let listEmailIgnore: any[] = [];
                if (emailIgnore.value.length == 1 && emailIgnore.value[0] == '') listEmailIgnore = [];
                else listEmailIgnore = emailIgnore.value;
                await saveReceiving(userStore.value.workspace_id, { email_incoming_ignore: listEmailIgnore }, '');
                await saveSending(userStore.value.workspace_id, dataSendingEmail.value);

                try {
                    changeReceiving.value = false;
                    dataSetting.value = dataEmail.value.setting;
                    changeSending.value = false;
                    addToast({
                        title: 'Setting changed successfully',
                        type: 'basic',
                        timeout: 3000,
                    });
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                }
            }
        };

        const cancelEmailConfiguration = () => {
            emitter.emit('resetDefaultData', dataSetting.value);
            addToast({
                title: 'All changes are discarded',
                type: 'basic',
                timeout: 3000,
            });
        };

        const checkDisableButtonSaveReceiving = (data: boolean) => {
            disableButtonSaveReceiving.value = data;
        };

        const checkDisableButtonSaveSending = (data: boolean) => {
            disableButtonSaveSending.value = data;
        };

        const checkDisableButtonSave = computed(() => {
            if (!disableButtonSaveReceiving.value && !disableButtonSaveSending.value) return false;
            else return true;
        });

        const getData = async () => {
            const data = await getReceiving(userStore.value.workspace_id);
            if (data) {
                dataSetting.value = data.data.setting;
                isLoading.value = true;
            }
        };

        onMounted(async () => {
            await getData();
        });

        onBeforeRouteLeave((to, from, next) => {
            emitter.emit('resetDefaultData', dataSetting.value);
            next();
        });

        return {
            tab,
            tabs,
            changeReceiving,
            checkDisableButton,
            checkChangeReceiving,
            saveEmailConfiguration,
            emailIgnore,
            dataSetting,
            isLoading,
            userStore,
            changeSending,
            checkChangeSending,
            dataSendingEmail,
            checkDisableButtonSave,
            cancelEmailConfiguration,
            dataEmail,
            disableButtonSaveReceiving,
            disableButtonSaveSending,
            checkDisableButtonSaveReceiving,
            checkDisableButtonSaveSending,
        };
    },
});
</script>

<style lang="scss">
.email-configuration {
    height: 100%;
    &__tab {
        height: calc(100% - 80px);
        > div {
            height: 100%;
        }
        .tab-content {
            height: calc(100% - 57px);
        }
        .tab-component__header {
            border-bottom: 1px solid #e0e0e0;
            nav {
                width: 232px;
                margin: 0 40px;
            }
            .tab {
                position: relative;
            }
            .tab__bar {
                position: absolute;
                bottom: -2px;
            }
        }
    }
}
</style>
