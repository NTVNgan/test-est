<template>
    <div class="reuired-email" ref="requiedEmail">
        <p class="text-14 font-medium">Requiring email for first message</p>
        <radio-component
            v-for="item in dataRequireEmail"
            :key="item"
            class="mt-12p"
            :valueRadio="item.value"
            v-model="widgetSettingDataSync.require_email_for_first_message"
            nameRadio="requiringEmail"
            @click="onClickRadio(item.value)"
        >
            <template v-slot:label>{{ item.label }}</template>
        </radio-component>
        <template
            v-if="
                widgetSettingDataSync.require_email_for_first_message == 1 ||
                widgetSettingDataSync.require_email_for_first_message == 2
            "
        >
            <input-component
                :state="errorEmailPlaceholder ? 'error' : 'primary'"
                v-model="widgetSettingDataSync.email_placeholder"
                class="mt-40p"
                label="Email placeholder"
                placeholder="Enter text"
                :maxlength="20"
                counter
            ></input-component>
            <span v-if="errorEmailPlaceholder" class="inline-block text-14 text-error-3 mt-4p"
                >Email placeholder must be at least 1 character.</span
            >
            <input-component
                :state="errorMessagePlaceholder ? 'error' : 'primary'"
                v-model="widgetSettingDataSync.messsage_placeholder"
                class="mt-40p"
                label="Message placeholder"
                placeholder="Enter text"
                :maxlength="50"
                counter
            ></input-component>
            <span v-if="errorMessagePlaceholder" class="inline-block text-14 text-error-3 mt-4p"
                >Message placeholder must be at least 1 character.</span
            >
        </template>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import RadioComponent from '@/components/ui/RadioButtonComponent.vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export default {
    name: 'SettingChatWidgetAccordionRequiringEmail',
    components: {
        InputComponent,
        RadioComponent,
    },
    props: {
        widgetSettingData: {
            type: Object,
            default: null,
        },
    },
    validations() {
        return {
            emailPlaceholder: {
                required,
            },
            messagePlaceholder: {
                required,
            },
        };
    },
    emits: ['update:widgetSettingData', 'disableSave'],
    setup(props: any, { emit }: any) {
        const emitter: any = inject('emitter');
        const requiringEmail = ref<number>(1);
        const v$ = useVuelidate();
        const requiedEmail = ref<HTMLElement>();
        const dataRequireEmail = ref<any>([
            { label: 'Only outside of office hours', value: 1 },
            { label: 'Always', value: 2 },
            { label: 'Never', value: 0 },
        ]);

        const widgetSettingDataSync = computed({
            get(): any {
                return props.widgetSettingData;
            },
            set(value: any) {
                emit('update:widgetSettingData', value);
            },
        });

        const onClickRadio = (value: number) => {
            if (!value) {
                emitter.emit('onResetWidget');
            }
        };

        const errorEmailPlaceholder = computed(() => {
            if (widgetSettingDataSync.value.email_placeholder == '') return true;
            return false;
        });

        const errorMessagePlaceholder = computed(() => {
            if (widgetSettingDataSync.value.messsage_placeholder == '') return true;
            return false;
        });

        const requestError = computed(() => {
            if (v$.value.emailPlaceholder.$invalid || v$.value.messagePlaceholder.$invalid) {
                emit('disableSave', true);
                return true;
            } else {
                emit('disableSave', false);
                return false;
            }
        });

        return {
            requiringEmail,
            errorEmailPlaceholder,
            errorMessagePlaceholder,
            widgetSettingDataSync,
            v$,
            requiedEmail,
            dataRequireEmail,
            requestError,
            onClickRadio,
        };
    },
};
</script>

<style lang="scss"></style>
