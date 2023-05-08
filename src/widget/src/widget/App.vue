<template>
    <div class="linebase-widget" :class="{ 'linebase-widget__demo-mode': isDemoMode }">
        <WidgetButton :showWidgetBox="isShowWidgetBox" :icon="isShowWidgetBox ? 'angle-down' : 'comments'" />
        <transition name="slide-fade-up">
            <WidgetBox
                v-show="isShowWidgetBox || isDemoMode"
                :isShowWidgetBox="isShowWidgetBox"
                :isDemoMode="isDemoMode"
                :widgetStatus="widgetStatus"
            />
        </transition>
        <template v-if="!isDemoMode">
            <image-slider
                v-model="showImageSlider"
                :convoId="conversation_id"
                :activeImageId="activeImageId"
            ></image-slider>
            <WidgetModalMessageEmail v-model="showMessageEmail" :messageData="messageData"></WidgetModalMessageEmail>
        </template>
    </div>
</template>

<script >
import { defineComponent, inject, ref, provide, computed } from 'vue';
import WidgetButton from '../components/WidgetButton.vue';
import WidgetBox from '../components/WidgetBox.vue';
import { useToggleWidgetBox } from '../composables/useToggleWidgetBox';
import ImageSlider from '../components/imageSliderComponent/index.vue';
import WidgetModalMessageEmail from '../components/modal/WidgetModalMessageEmail.vue';

export default defineComponent({
    components: {
        WidgetButton,
        WidgetBox,
        ImageSlider,
        WidgetModalMessageEmail,
    },
    props: {
        isDemoMode: Boolean,
        settings: {
            default: null,
        },
        widgetStatus: {
            default: 3,
        },
    },
    setup(props) {
        const { isShowWidgetBox } = useToggleWidgetBox();
        const activeImageId = ref(null);
        const showImageSlider = ref(false);
        const onOpenImageGallery = (id) => {
            activeImageId.value = id;
            showImageSlider.value = true;
        };
        const indexLanguage = ref(null);
        const emitter = inject('emitter');
        provide('isDemoMode', props.isDemoMode);

        emitter.on('updateIndexLanguage', (val) => {
            indexLanguage.value = val;
        })

        // Setting Value
        const settingWidgetValues = computed(() => {
            let data;
            if (props.settings) {
                data = JSON.parse(JSON.stringify(props.settings));
            } else data = null;
            if (data !== null && data.welcome_message) {
                if (indexLanguage.value !== null) { 
                    data.welcome_message_select = data.welcome_message[indexLanguage.value];
                } else { 
                    data.welcome_message_select = data.welcome_message.find((item) => item.default);
                }
            }
            return data;
        });
        provide('settingWidgetValues', settingWidgetValues);
        
        if (!props.isDemoMode) {
            const { conversation_id } = inject('contact');

            const showMessageEmail = ref(false);
            const messageData = ref();
            const onOpenModalMessageEmail = (message) => {
                showMessageEmail.value = true;
                messageData.value = message;
            };

            provide('onOpenImageGallery', onOpenImageGallery);
            provide('onOpenModalMessageEmail', onOpenModalMessageEmail);
            return {
                isShowWidgetBox,
                showImageSlider,
                showMessageEmail,
                conversation_id,
                activeImageId,
                messageData,
            };
        }
        return {
            isShowWidgetBox,
            onOpenImageGallery,
            activeImageId,
            indexLanguage,
        };
    },
});
</script>

<style lang="scss">
.linebase-widget {
    font-family: 'Roboto', 'sans-serif';
    font-weight: 400;
    color: #141417;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
