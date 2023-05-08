<template>
    <div class="lb-input" :class="error ? 'lb-input--error' : ''">
        <div>
            <slot></slot>
        </div>
        <input v-if="!textArea" :type="type" :placeholder="placeholder" v-model="valueSync" />
        <textarea v-else v-model="valueSync" :placeholder="placeholder" />
    </div>
</template>

<script>
import { ref, computed } from 'vue';
export default {
    name: 'InputComponent',
    props: {
        placeholder: {
            default: '',
            type: String,
        },
        type: {
            default: 'text',
            type: String,
        },
        textArea: {
            default: false,
            type: Boolean,
        },
        error: {
            default: false,
            type: Boolean,
        },
        modelValue: {
            type: [String, Number],
            default: '',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const valueSync = computed({
            get() {
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            },
        });

        return {
            valueSync,
        };
    },
};
</script>

<style scoped lang="scss">
.lb-input {
    &--error {
        border: 1px #ec2b08 solid;
    }
    display: flex;
    align-items: center;
    background: #f2f2f2;
    padding: 10px 16px;
    width: 328px;
    border-radius: 20px;
    border: 1px #f2f2f2 solid;
    font-size: 14px;
    > div {
        margin-right: 4px;
        align-self: flex-start;
    }
    input,
    textarea {
        width: -webkit-fill-available;
        background: #f2f2f2;
        outline: none;
    }
    textarea {
        height: 88px !important;
        resize: none;
    }
    ::-webkit-scrollbar {
        cursor: pointer;
        width: 16px;
    }
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 16px 16px transparent;
        border: solid 4px transparent;
    }
    ::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 16px 16px #b4b4be;
        border: solid 4px transparent;
        border-radius: 16px;
    }

    ::-webkit-scrollbar-button {
        display: none;
    }
}
</style>