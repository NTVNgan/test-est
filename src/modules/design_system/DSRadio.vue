<template>
    <div class="p-16p">
        <h4 class="mb-4p text-center">Group Radio</h4>
        <div class="ds-radio grid grid-flow-col grid-cols-2 mb-16p">
            <div class="border-r-2">
                <label
                    for="type"
                    class="text-center block text-sm font-bold text-gray-700 mb-12p"
                >Default</label>
                <Radio v-for="(item, i) in optionRadio" :key="i" :valueRadio="item.value" v-model="picked" nameRadio="groupRadio" @change="onChange">
                    <template v-slot:label>{{item.label}}</template>
                </Radio>
            </div>
            <div>
                <label
                    for="type"
                    class="text-center block text-sm font-bold text-gray-700 mb-12p"
                >Disable</label>
                <!-- <radio
                    default-value="22"
                    :nameGroupRadio="'radio'"
                    :typeRadio="'group'"
                    :optionGroupRadio="optionRadio1"
                >
                    <template #label="{item}">{{item.label}}</template>
                </radio> -->
                <Radio valueRadio="11" v-model="picked1" disabledRadio nameRadio="groupRadio1">
                    <template v-slot:label>1</template>
                </Radio>
                <Radio valueRadio="22" v-model="picked1" nameRadio="groupRadio1">
                    <template v-slot:label>2</template>
                </Radio>
                <Radio valueRadio="33" v-model="picked1" nameRadio="groupRadio1">
                    <template v-slot:label>3</template>
                    <template v-slot:custom>
                        <div>123</div>
                    </template>
                </Radio>
            </div>
        </div>
        <h4 class="mb-4p text-center">Single Radio</h4>
        <div class="ds-radio grid grid-flow-col grid-cols-2 mb-16p">
            <div class="border-r-2">
                <label
                    for="type"
                    class="text-center block text-sm font-bold text-gray-700 mb-12p"
                >Default</label>
                <Radio :valueRadio="'label'" :nameRadio="'111'" @change="onChange" v-model="picked2">
                    <template v-slot:label>Label</template>
                </Radio>
            </div>
            <div>
                <label
                    for="type"
                    class="text-center block text-sm font-bold text-gray-700 mb-12p"
                >Disable</label>
                <Radio disabledRadio :valueRadio="'label'" nameRadio="groupRadio2" v-model="picked3">
                    <template v-slot:label>Label</template>
                </Radio>
                <Radio disabledRadio :valueRadio="'label2'" nameRadio="groupRadio2" v-model="picked3">
                    <template v-slot:label>Label</template>
                </Radio>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import Radio from '@/components/ui/RadioButtonComponent.vue';

export default defineComponent({
    name: 'Radio Component',
    components: {
        Radio,
    },
    setup() {
        const optionRadio = reactive([
            { label: '1', value: '11' },
            { label: '2', value: '22' },
            { label: '3', value: '33' },
        ]);

        const optionRadio1 = reactive([
            { label: '1', value: '11', disable: true },
            { label: '2', value: '22' },
            { label: '3', value: '33' },
        ]);
        const optionRadio2 = reactive([
            { label: '1', value: '11', disable: true },
            { label: '2', value: '22' },
            { label: '3', value: '33' },
        ]);

        const picked = ref(''),
            picked1 = ref('22'),
            picked2 = ref(''),
            picked3 = ref('label2');

        return {
            optionRadio,
            optionRadio1,
            optionRadio2,
            picked,
            picked1,
            picked2,
            picked3,
        };
    },
    methods: {
        /* eslint-disable */
        onChange(e: any) {
            console.log(e);
        },
    },
});
</script>

<style lang="scss">
.ds-radio {
    .radio-group {
        margin: 10px auto;
        width: 100%;
        max-width: 60px;
    }
}
</style>
