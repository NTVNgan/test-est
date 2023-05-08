<template>
    <div class="h-full w-full relative">
        <template v-if="isLoading">
            <div class="pt-24p px-40p">
                <div class="flex justify-between">
                    <span class="font-semibold text-24 font-heading">{{ $t('setting.chat_widget_title') }}</span>
                    <div class="flex justify-between" :class="{ 'opacity-0 invisible': !showGroupButton }">
                        <button-component class="mr-8p" size="medium" type="outline" @click="cancelWidget">
                            {{ $t('setting.chat_widget_button_cancel') }}
                        </button-component>
                        <button-component
                            :disabled="disableBtnSave"
                            size="medium"
                            type="primary"
                            @click="saveChatWidget"
                        >
                            {{ $t('setting.chat_widget_button_save') }}
                        </button-component>
                    </div>
                </div>
                <p class="mt-2p text-14 text-neutrals-500">
                    {{ $t('setting.chat_widget_subtitle') }}
                </p>
            </div>
            <div class="mt-32p pl-40p setting-widget__wrapper">
                <scrollbar-component class="h-full">
                    <div class="flex items-start">
                        <div class="setting-widget__config mb-20p">
                            <accordion multiple :activeIndex="activeIndex" fontSizeHeader="text-16">
                                <accordion-tab
                                    key="0"
                                    :header="$t('setting.chat_widget_accordion_header_greeting')"
                                    icon="GreetingRegular14"
                                >
                                    <SettingChatWidgetAccordionGreeting v-model:widgetSettingData="widgetSettingData" />
                                </accordion-tab>
                                <accordion-tab
                                    key="1"
                                    :header="$t('setting.chat_widget_accordion_header_time')"
                                    icon="ClockRegular14"
                                >
                                    <SettingChatWidgetAccordionTime
                                        v-model:widgetSettingData="widgetSettingData"
                                        @disableSave="disableSave"
                                        v-model:discardData="discardDataTime"
                                    />
                                </accordion-tab>
                                <accordion-tab
                                    key="2"
                                    :header="$t('setting.chat_widget_accordion_header_widget_behavior')"
                                    icon="CogRegular14"
                                >
                                    <SettingChatWidgetAccordionWidgetBehavior
                                        v-model:widgetSettingData="widgetSettingData"
                                    />
                                </accordion-tab>
                                <accordion-tab
                                    key="3"
                                    :header="$t('setting.chat_widget_accordion_header_requiring_email')"
                                    icon="InboxRegular14"
                                >
                                    <SettingChatWidgetAccordionRequiringEmail
                                        v-model:widgetSettingData="widgetSettingData"
                                        @disableSave="disableSave"
                                    />
                                </accordion-tab>
                            </accordion>
                        </div>
                        <div class="setting-widget__preview">
                            <Widget
                                :key="widgetCompKey"
                                isDemoMode
                                :settings="widgetSettingData"
                                :widgetStatus="widgetStatus"
                            />
                            <div
                                class="
                                    text-center
                                    flex
                                    items-center
                                    width-full
                                    self-center
                                    mt-20p
                                    cursor-pointer
                                    text-14
                                    font-medium
                                    justify-center
                                "
                                v-if="widgetStatus !== WIDGET_STATUS.HOME"
                                @click="onResetStatusWidget"
                            >
                                <icon-component name="undo-alt" class="mr-4p" />
                                <span>{{ $t('setting.chat_widget_button_reset_widget') }}</span>
                            </div>
                        </div>
                    </div>
                </scrollbar-component>
            </div>
            <!-- <div class="text-24 font-semibold flex items-center justify-between">
                <h2 class="text-24 font-heading">{{ $t('setting.chat_widget_title') }}</h2>
            </div> -->
        </template>
        <template v-else>
            <LoadingScreen />
        </template>
        <ModalDiscard v-model:showModal="isShowModalWarning" @discard="returnDefault"></ModalDiscard>
        <ModalUnsave v-model:showModal="isShowModalUnsave" @discard="returnDefault"></ModalUnsave>
    </div>
</template>

<script lang="ts">
import { ref, provide, onMounted, inject, watch } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ScrollbarComponent from '@/components/ui/ScrollbarComponent.vue';
import Accordion from '@/components/ui/AccordionComponent.vue';
import AccordionTab from '@/components/ui/AccordionPanel.vue';
import SettingChatWidgetAccordionGreeting from '../components/SettingChatWidget/SettingChatWidgetAccordionGreeting.vue';
import SettingChatWidgetAccordionTime from '../components/SettingChatWidget/SettingChatWidgetAccordionTime.vue';
import SettingChatWidgetAccordionWidgetBehavior from '../components/SettingChatWidget/SettingChatWidgetAccordionWidgetBehavior.vue';
import SettingChatWidgetAccordionRequiringEmail from '../components/SettingChatWidget/SettingChatWidgetAccordionRequiringEmail.vue';
import Widget from '@/widget/src/widget/App.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useChatWidget } from '../composables/useChatWidget';
import LoadingScreen from '@/modules/auth/components/AuthLoadingScreen.vue';
import isEqual from 'lodash/isEqual';
import ModalDiscard from '../components/SettingChatWidget/SettingWidgetDiscard.vue';
import ModalUnsave from '../components/SettingChatWidget/SettingWidgetUnsave.vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';

const WIDGET_STATUS = {
    HOME: 1,
    EMAIL_INPUT: 2,
    CHAT: 3,
};

export default {
    name: 'SettingChatWidget',
    components: {
        IconComponent,
        Widget,
        ButtonComponent,
        ScrollbarComponent,
        Accordion,
        AccordionTab,
        SettingChatWidgetAccordionGreeting,
        SettingChatWidgetAccordionTime,
        SettingChatWidgetAccordionWidgetBehavior,
        SettingChatWidgetAccordionRequiringEmail,
        LoadingScreen,
        ModalDiscard,
        ModalUnsave,
    },
    setup() {
        const emitter: any = inject('emitter');

        provide('contact', { org_id: null, workspace_id: null, conversation_id: null });
        provide('onOpenImageGallery', null);
        provide('onOpenModalMessageEmail', null);
        provide('socket', {});

        const { getWidgetSetting, updateWidgetSetting } = useChatWidget();
        const isLoading = ref<boolean>(false);
        const widgetCompKey = ref<number>(0);
        const activeIndex = ref<number[]>([0]);
        const widgetSettingDataClone = ref<any>(null);
        const showGroupButton = ref<boolean>(false);
        const widgetSettingData = ref<any>(null);
        const widgetStatus = ref(WIDGET_STATUS.HOME);
        const isShowModalWarning = ref<boolean>(false);
        const isShowModalUnsave = ref<boolean>(false);
        const disableBtnSave = ref<boolean>(false);
        const discardDataTime = ref<boolean>(false);
        const routerTo = ref<any>('');
        const router = useRouter();
        const { addToast } = useToast();

        const onResetStatusWidget = () => {
            widgetStatus.value = WIDGET_STATUS.HOME;
            // widgetCompKey.value++;
        };

        emitter.on('onChangeStatusWidget', (from: number) => {
            console.log({ from });
            if (widgetStatus.value === WIDGET_STATUS.HOME) {
                widgetStatus.value = widgetSettingData.value.require_email_for_first_message
                    ? WIDGET_STATUS.EMAIL_INPUT
                    : WIDGET_STATUS.CHAT;
            } else if (widgetStatus.value == WIDGET_STATUS.EMAIL_INPUT) widgetStatus.value = WIDGET_STATUS.CHAT;
            console.log(widgetStatus.value);
        });

        emitter.on('onResetWidget', () => {
            onResetStatusWidget();
        })

        const getWidgetSettingData = async () => {
            const data = await getWidgetSetting();
            widgetSettingData.value = JSON.parse(JSON.stringify(data));
            widgetSettingDataClone.value = JSON.parse(JSON.stringify(widgetSettingData.value));
            isLoading.value = true;
        };

        const saveChatWidget = async () => {
            try {
                await updateWidgetSetting(widgetSettingData.value);
                showGroupButton.value = false;
                widgetSettingDataClone.value = JSON.parse(JSON.stringify(widgetSettingData.value));
                addToast({
                    title: 'Setting changed successfully',
                    type: 'basic',
                    timeout: 3000, 
                });
            } catch (e) {
                console.log(e);
            }
        };

        const returnDefault = () => {
            widgetSettingData.value = JSON.parse(JSON.stringify(widgetSettingDataClone.value));
            discardDataTime.value = true;
            router.push({ name: routerTo.value });
        };

        const cancelWidget = () => {
            isShowModalWarning.value = true;
        };

        const disableSave = (val: boolean) => {
            disableBtnSave.value = val;
        };

        onMounted(async () => {
            await getWidgetSettingData();
        });

        watch(
            () => widgetSettingData.value,
            (newVal, oldVal) => {
                showGroupButton.value = !isEqual(widgetSettingData.value, widgetSettingDataClone.value);
            },
            { deep: true },
        );

        onBeforeRouteLeave((to, from, next) => {
            // isShowModalUnsave.value = true;
            if (showGroupButton.value) {
                isShowModalUnsave.value = true;
                routerTo.value = to.name;
            } else {
                next();
            }
        });

        return {
            widgetSettingData,
            widgetSettingDataClone,
            activeIndex,
            getWidgetSettingData,
            isLoading,
            widgetStatus,
            onResetStatusWidget,
            widgetCompKey,
            WIDGET_STATUS,
            saveChatWidget,
            showGroupButton,
            cancelWidget,
            isShowModalWarning,
            returnDefault,
            isShowModalUnsave,
            disableSave,
            disableBtnSave,
            discardDataTime,
        };
    },
};
</script>

<style lang="scss">
.setting-widget {
    &__wrapper {
        height: calc(100% - 114px);
        .scrollbar__content {
            overflow-x: hidden;
        }
    }
    &__config {
        width: 55%;
        min-width: 514px;
        max-width: 800px;
        .accordion-body-details {
            padding: 16px 16px 24px;
        }
    }
    &__preview {
        width: 45%;
        position: sticky;
        top: 16px;
        margin-top: 16px;
    }
}
</style>
