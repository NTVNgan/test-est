<template>
    <div class="setting-dropdown">
        <Dropdown :disabled="disabled">
            <template #header>
                <div ref="dropdownButtonEl" :id="`dropdownButtonElement${id}`">
                    <div
                        @click.stop.prevent="toggleDropdown"
                        class="text-center"
                        :class="{ 'text-primary-500 font-medium	': showDropdown }"
                        :key="compKey"
                    >
                        <slot name="header"></slot>
                    </div>
                </div>
            </template>
            <template #list>
                <teleport to="#dropdown">
                    <div
                        ref="dropdownEl"
                        :id="`dropdownElement${id}`"
                        v-click-outside="() => (showDropdown ? (showDropdown = false) : null)"
                        @click="() => (showDropdown ? (showDropdown = false) : null)"
                        v-if="showDropdown"
                        :style="{
                            right: dropdownRight !== 'auto' ? `${dropdownRight}px` : dropdownRight,
                            left: dropdownLeft !== 'auto' ? `${dropdownLeft}px` : dropdownLeft,
                            top: dropdownTop !== 'auto' ? `${dropdownTop}px` : dropdownTop,
                            bottom: dropdownBottom !== 'auto' ? `${dropdownBottom}px` : dropdownBottom,
                            width,
                            height,
                        }"
                        class="fixed z-999 bg-white text-14 rounded-4p shadow-deep-1 overflow-y-auto scrollbar p-8p"
                    >
                        <slot name="content"></slot>
                    </div>
                </teleport>
            </template>
        </Dropdown>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch, nextTick, inject, onUnmounted } from 'vue';
import Dropdown from '@/components/ui/DropdownComponent.vue';
export default {
    name: 'SettingDropdown',
    components: {
        Dropdown,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        width: {
            type: String,
            default: '256px',
        },
        height: {
            type: String,
            default: 'auto',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any) {
        // const dropdownEl = ref<HTMLElement>();
        // const dropdownButtonEl = ref<HTMLElement>();
        const emitter: any = inject('emitter');
        const dropdownRight = ref<number | string>(0);
        const dropdownLeft = ref<number | string>('auto');
        const dropdownTop = ref<number | string>(0);
        const dropdownBottom = ref<number | string>('auto');
        const compKey = ref<number>(0);
        const showDropdown = ref<boolean>(false);

        emitter.on('toggleDropdown', (id: string) => {
            if (id !== props.id && showDropdown.value) {
                showDropdown.value = false;
            }
        });

        emitter.on('table-scroll', () => {
            compKey.value++;
            showDropdown.value = false;
        });

        const setPositionDropdown = () => {
            const dropdownElement: HTMLElement | null = document.getElementById(`dropdownElement${props.id}`);
            const dropdownButtonElement: HTMLElement | null = document.getElementById(
                `dropdownButtonElement${props.id}`,
            );
            if (dropdownElement && dropdownButtonElement) {
                const rangeBottomToScreen = window.innerHeight - dropdownButtonElement.getBoundingClientRect().top;
                if (rangeBottomToScreen - 20 < dropdownElement.getBoundingClientRect().height) {
                    dropdownTop.value =
                        dropdownButtonElement.getBoundingClientRect().bottom -
                        dropdownElement.getBoundingClientRect().height -
                        dropdownButtonElement.getBoundingClientRect().height;
                } else {
                    dropdownTop.value = dropdownButtonElement.getBoundingClientRect().bottom;
                    dropdownBottom.value = 'auto';
                }
                dropdownLeft.value =
                    dropdownButtonElement.getBoundingClientRect().right - dropdownElement.offsetWidth - 4; // margin right 4px
            }
        };

        const toggleDropdown = async () => {
            showDropdown.value = !showDropdown.value;
            await nextTick();
            setPositionDropdown();
            if (showDropdown.value) {
                emitter.emit('toggleDropdown', props.id);
            }
        };

        onUnmounted(() => {
            emitter.off('toggleDropdown', (id: string) => {
                if (id !== props.id && showDropdown.value) {
                    showDropdown.value = false;
                }
            });
        });

        return {
            showDropdown,
            toggleDropdown,
            dropdownRight,
            dropdownLeft,
            dropdownTop,
            dropdownBottom,
            compKey,
        };
    },
};
</script>

<style>
</style>