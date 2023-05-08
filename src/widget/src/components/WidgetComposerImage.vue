<template>
    <div class="widget-composer__image" v-if="!iconImage">
        <label for="widgetImg">
            <input
                type="file"
                class="widget-composer__image-input"
                ref="file"
                id="widgetImg"
                name="files[]"
                @change="onChange"
                multiple
            />
        </label>
        <Tooltip size="small" type="dark" position="top-right" content="Attach an image">
            <label class="widget-composer__attach-border" :for="!isDemoMode ? 'widgetImg' : ''">
                <Union class="widget-composer__attach-btn" />
            </label>
        </Tooltip>
    </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue';
import Union from './icons/Union.vue';
import Tooltip from './WidgetTooltip.vue';

export default {
    name: 'WidgetComposerImage',
    components: {
        Union,
        Tooltip,
    },
    props: {
        isDemoMode: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        // const arrImage = ref([]);
        const emitter = inject('emitter');
        const file = ref(null);
        const iconImage = ref(false);

        const onChange = (e) => {
            if (e.target !== undefined) {
                const images = e.target.files;
                emitter.emit('arrComposeImg', images);
            } else {
                emitter.emit('arrComposeImg', e);
            }
        };

        emitter.on('sendDropData', async (value) => {
            onChange(value);
        });

        emitter.on('closeSlideWidget', async (data) => {
            if (data) {
                iconImage.value = !data;
            }
        });

        emitter.on('dnoneIcon', (data) => {
            iconImage.value = data;
        });

        onMounted(() => {
            window.setTimeout(() => {
                const parentNode = document.querySelector('.widget-composer');
                if (parentNode) {
                    parentNode.addEventListener('paste', (e) => {
                        if (e.clipboardData.files.length > 0) onChange(e.clipboardData.files);
                    });
                }
            }, 0);
        });

        return {
            file,
            onChange,
            iconImage,
        };
    },
};
</script>

<style lang="scss" scoped>
.widget-composer {
    &__image {
        margin-left: 8px;
        &-input {
            width: 1px;
            height: 1px;
            overflow: hidden;
            opacity: 0;
            display: none !important;
        }
    }
}
</style>