<template>
    <div class="flex aligns">
        <button-group type="default" v-if="type === 'button'">
            <button-comp
                @click="onPressedPage(current - 1)"
                :disabled="current === 1"
                size="large"
                icon="long-arrow-left"
                type="subtle"
            >
            </button-comp>
            <template v-if="totalVal === 1 && current === 1">
                <button-comp @click="onPressedPage(1)" size="large" type="primary">1</button-comp>
            </template>

            <template v-else-if="current < totalVal">
                <button-comp @click="onPressedPage(current - 1)" v-if="current !== 1" size="large" type="subtle">{{
                    current - 1
                }}</button-comp>
                <button-comp size="large" type="primary">{{ current }}</button-comp>
                <button-comp
                    @click="onPressedPage(current + 1)"
                    v-if="current !== totalVal"
                    size="large"
                    type="subtle"
                    >{{ current + 1 }}</button-comp
                >
            </template>

            <template v-else-if="totalVal === current">
                <button-comp @click="onPressedPage(totalVal - 1)" size="large" type="sublte">{{
                    totalVal - 1
                }}</button-comp>
                <button-comp size="large" type="primary">{{ totalVal }}</button-comp>
            </template>

            <button-comp
                @click="onPressedPage(current + 1)"
                :disabled="current === totalVal"
                size="large"
                icon="long-arrow-right"
                type="subtle"
            >
            </button-comp>
        </button-group>

        <button-group type="default" v-else-if="type === 'link'">
            <button-comp v-if="current > 1" @click="onPressedPage(current - 1)" size="medium" type="link"
                >Prev</button-comp
            >

            <button-comp
                :class="[current === 1 ? activeBtnClass : unActiveBtnClass]"
                @click="onPressedPage(1)"
                size="medium"
                type="link"
                >1</button-comp
            >

            <template v-if="current > 2">
                <button-comp v-if="current !== 3" size="medium" type="link">...</button-comp>
                <button-comp
                    v-if="current === totalVal && totalVal > 3"
                    @click="onPressedPage(current - 2)"
                    size="medium"
                    type="link"
                    :class="unActiveBtnClass"
                    >{{ current - 2 }}</button-comp
                >
                <button-comp :class="unActiveBtnClass" @click="onPressedPage(current - 1)" size="medium" type="link">{{
                    current - 1
                }}</button-comp>
            </template>

            <button-comp
                :class="[activeBtnClass]"
                v-if="current != 1 && current !== totalVal"
                size="medium"
                type="link"
                >{{ current }}</button-comp
            >

            <template v-if="current < totalVal - 1">
                <button-comp @click="onPressedPage(current + 1)" :class="unActiveBtnClass" size="medium" type="link">{{
                    current + 1
                }}</button-comp>
                <button-comp size="medium" type="link" v-if="current !== totalVal - 2">...</button-comp>
            </template>

            <button-comp
                @click="onPressedPage(totalVal)"
                :class="[current === totalVal ? activeBtnClass : unActiveBtnClass]"
                size="medium"
                type="link"
                >{{ totalVal }}</button-comp
            >

            <button-comp @click="onPressedPage(current + 1)" v-if="current < totalVal" size="medium" type="link"
                >Next</button-comp
            >
        </button-group>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import ButtonGroup from '@/components/ui/ButtonGroupComponent.vue';
import ButtonComp from '@/components/ui/ButtonComponent.vue';

export default defineComponent({
    name: 'Pagination',
    props: {
        total: {
            type: Number,
            default: 99,
        },
        defaultCurrent: {
            type: Number || String,
            default: 8,
        },
        modelValue: {
            type: Number,
            default: 1,
        },
        type: {
            type: String,
            default: 'link',
        },
    },
    components: {
        ButtonGroup,
        ButtonComp,
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const activeBtnClass = 'text-primary-700 underline border-none focus:border-none';

        const unActiveBtnClass = 'border-none focus:border-none ';
        // const unActiveBtnClass = '';

        const totalVal = ref(props.total);

        const current = ref(props.modelValue ? props.modelValue : props.defaultCurrent);

        const onPressedPage = (num: number) => {
            if (current.value !== num) current.value = num;
            emit('update:modelValue', current.value);
            emit('change', { current: current.value, total: props.total });
        };

        watch(
            () => props.modelValue,
            newVal => {
                if (newVal !== current.value) {
                    current.value = newVal;
                }
            },
        );

        watch(
            () => props.total,
            newval => {
                totalVal.value = newval;
            },
        );

        return {
            activeBtnClass,
            unActiveBtnClass,
            current,
            onPressedPage,
            totalVal,
        };
    },
});
</script>
