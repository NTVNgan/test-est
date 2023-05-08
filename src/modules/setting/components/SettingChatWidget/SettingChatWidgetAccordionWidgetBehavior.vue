<template>
    <div class="mb-40p">
        <span class="text-14 font-medium block mb-12p">Typing indicator</span>
        <div class="flex items-center justify-between">
            <span class="text-14">Show typing indicator when teammate composing message</span>
            <toggle-comp v-model="widgetSettingDataSync.widget_behavior.typing_indicator" size="medium"></toggle-comp>
        </div>
    </div>
    <div class="mb-40p">
        <span class="text-14 font-medium block mb-12p">Visibilities</span>
        <div class="flex items-center justify-between  mb-12p">
            <span class="text-14">Show widget outside of office hours</span>
            <toggle-comp
                v-model="widgetSettingDataSync.widget_behavior.show_widget_when_offline"
                size="medium"
            ></toggle-comp>
        </div>
        <div class="flex items-center justify-between mb-12p">
            <span class="text-14">Show widget on load in mobile</span>
            <toggle-comp
                v-model="widgetSettingDataSync.widget_behavior.show_widget_onload_in_mobile"
                size="medium"
            ></toggle-comp>
        </div>
        <div class="flex items-center justify-between">
            <span class="text-14">Show LineBase’s watermark in footer</span>
            <toggle-comp v-model="widgetSettingDataSync.widget_behavior.show_watermark" size="medium"></toggle-comp>
        </div>
    </div>
    <div>
        <span class="text-14 font-medium block mb-12p">Feature setting</span>
        <div class="flex items-center justify-between mb-12p">
            <span class="text-14">Allow customer compose with emoji</span>
            <toggle-comp v-model="widgetSettingDataSync.widget_behavior.compose_emoji" size="medium"></toggle-comp>
        </div>
        <div class="flex items-center justify-between">
            <span class="text-14">Allow customer upload image</span>
            <toggle-comp v-model="widgetSettingDataSync.widget_behavior.upload_file" size="medium"></toggle-comp>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import ToggleComp from '@/components/ui/ToggleComponent.vue';

export default {
    name: 'SettingChatWidgetAccordionWidgetBehavior',
    components: {
        ToggleComp,
    },
    props: {
        widgetSettingData: {
            type: Object,
            default: null,
        },
    },
    setup(props: any, { emit }: any) {
        const widgetSettingDataSync = computed({
            get(): any {
                return props.widgetSettingData;
            },
            set(value: any) {
                emit('update:widgetSettingData', value);
            },
        });

        return {
            widgetSettingDataSync,
        };
    },
};
</script>

<style lang="scss"></style>
