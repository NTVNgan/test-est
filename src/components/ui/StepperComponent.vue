<template>
    <div class="stepper-comp flex flex-col justify-between">
        <div class="relative cursor-pointer no-select" :class="disabledUp ? '' : classAtt" @click="onPressed('up')">
            <icon-component
                class="relative"
                name="caretUp"
                :color="disabled || disabledUp ? 'neutrals-300' : ''"
            ></icon-component>
        </div>
        <div class="relative cursor-pointer no-select" :class="disabledDown ? '' : classAtt" @click="onPressed('down')">
            <icon-component
                class="relative"
                name="caretDown"
                :color="disabled || disabledDown ? 'neutrals-300' : ''"
            ></icon-component>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import IconComponent from './IconComponent.vue';

export default defineComponent({
    props: {
        disabled: {
            type: Boolean,
        },
        disabledUp: {
            type: Boolean,
        },
        disabledDown: {
            type: Boolean,
        },
    },
    components: {
        IconComponent,
    },
    emits: ['pressed'],
    setup(props, { emit }) {
        const classAtt = computed(() => {
            const state = {
                'bg-neutrals-50 hover:bg-neutrals-100 active:bg-neutrals-200': !props.disabled,
                'bg-neutrals-50': props.disabled,
            };
            return {
                ...state,
            };
        });

        const onPressed = (type: string) => {
            if ((type == 'up' && !props.disabledUp) || (type == 'down' && !props.disabledDown)) emit('pressed', type);
        };

        return {
            classAtt,
            onPressed,
        };
    },
});
</script>

<style lang="scss" scoped>
.stepper-comp {
    width: fit-content;
    height: 32px;
    > div:first-child {
        border-radius: 4px 4px 0px 0px;
        :deep(i) {
            left: 23%;
            top: 19%;
        }
    }
    > div:last-child {
        border-radius: 0px 0px 4px 4px;
        :deep(i) {
            left: 23%;
            top: 19%;
        }
    }
    > div {
        height: 14px;
        width: 18px;
    }
}
.no-select {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
