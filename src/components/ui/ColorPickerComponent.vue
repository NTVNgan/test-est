<template>
    <div class="color-picker-component" v-click-outside="closeColorBox">
        <div
            class="color-picker__label flex items-center mb-4p"
            :class="{ 'disabled cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
            @mouseup="isShowColorPicker = true"
            @mousedown="isShowColorPicker = false"
        >
            <button
                class="color rounded-4p mr-8p"
                :class="{ hideFocus: isShowColorPicker, 'cursor-not-allowed': disabled }"
                :style="{ backgroundColor: colorPickerValue }"
            ></button>
            <label
                class="title text-14"
                :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed text-neutrals-300': disabled }"
                >Label</label
            >
        </div>
        <ColorPicker
            v-show="isShowColorPicker && !disabled"
            default-format="hex"
            :color="colorPickerValue"
            @color-change="updateColor"
        >
            <template #hue-range-input-label>
                <span class="sr-only">Hue</span>
            </template>

            <template #alpha-range-input-label>
                <span class="sr-only">Alpha</span>
            </template>
        </ColorPicker>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ColorPicker } from 'vue-accessible-color-picker';

export default defineComponent({
    name: 'ColorPickerComponent',
    props: {
        modelValue: {
            type: String,
            default: '#000000',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            isShowColorPicker: false,
        };
    },
    components: {
        ColorPicker,
    },
    computed: {
        colorPickerValue() {
            return this.modelValue;
        },
    },
    methods: {
        updateColor(e) {
            this.$emit('update:modelValue', e.cssColor);
            // this.$emit('onChange', e.cssColor);
        },
        closeColorBox() {
            this.isShowColorPicker = false;
        },
    },
});
</script>

<style lang="scss">
.color-picker-component {
    width: 176px;
    position: relative;
    .color-picker__label {
        width: max-content;
        .color {
            width: 24px;
            height: 24px;
            border: 1px solid transparent;
            &:focus {
                outline: 1px auto #3e6dda;
            }
            &:active {
                outline: 1px auto #3e6dda;
            }
            &.hideFocus:focus {
                outline: none;
            }
        }
        &.disabled {
            .color {
                border-color: transparent;
                opacity: 0.5;
                outline: none;
            }
        }
    }
    .vacp-color-picker {
        padding: 8px 8px 16px;
        border-radius: 4px;
        grid-gap: 9px;
        grid-template-areas:
            'color-space color-space'
            'hue-input hue-input'
            'alpha-input alpha-input'
            'color-inputs color-inputs';
        position: absolute;
        left: 0;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.1);
        z-index: 1;
        .vacp-copy-button,
        .vacp-format-switch-button,
        .vacp-color-input-label-text {
            display: none;
        }
        .vacp-color-space {
            height: 100px;
        }
    }
    input.vacp-color-input {
        color: #141417;
        margin-top: 4px;
        border-radius: 4px;
        padding: 8px 12px;
        text-align: left;
        font-size: 14px;
        border-color: #3e6dda;
        outline: none;
        &:focus {
            border-color: #3e6dda;
            outline: none;
        }
    }
    .vacp-color-space-thumb {
        box-shadow: none;
        --vacp-thumb-size: 12px;
        border-width: 2px;
    }
    .vacp-range-input-label {
        --vacp-slider-thumb-size: 12px;
        outline: none;
    }
    .vacp-range-input {
        -webkit-appearance: none;
        width: 100%;
        height: 16px;
        appearance: none;
        border: none;
        margin: 0;
    }
    .vacp-range-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        border-radius: 30px;
        outline: none;
        box-shadow: none;
        border-width: 2px;
    }
    .vacp-range-input::-webkit-slider-runnable-track {
        border-radius: 30px;
        outline: none;
    }
    .vacp-range-input::-moz-focus-outer {
        border: 0;
    }
    .vacp-range-input:hover {
        outline: none;
    }
    .vacp-range-input:focus {
        --vacp-focus-color: none;
    }
}
</style>
