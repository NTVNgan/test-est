<template>
    <div class="mt-8p px-16p py-8p bg-white h-full flex flex-col rounded-4p">
        <div class="flex justify-between items-center">
            <span class="text-14 text-primary-500 font-bold">FILTER</span>
            <icon-component class="cursor-pointer" name="times" color="neutrals-900" @click="onClose"></icon-component>
        </div>
        <div class="mt-20p flex-grow">
            <span class="font-medium text-14">By status</span>
            <div class="mt-12p w-fit flex">
                <div
                    class="text-12 font-medium cursor-pointer py-2p px-8p bg-neutrals-100 mr-8p rounded-20p border"
                    @click="onClickStatus('open')"
                    :class="{
                        'border-primary-500': statusActive === 'open',
                        'border-neutrals-100': statusActive !== 'open',
                    }"
                >
                    Open
                </div>
                <div
                    class="text-12 font-medium cursor-pointer py-2p px-8p bg-neutrals-100 rounded-20p border-2p border"
                    @click="onClickStatus('resolved')"
                    :class="{
                        'border-primary-500': statusActive === 'resolved',
                        'border-neutrals-100': statusActive !== 'resolved',
                    }"
                >
                    Resolved
                </div>
            </div>
        </div>
        <div class="flex self-end">
            <button-component @click="onClose" size="medium" type="outline" class="mr-8p"> Cancel </button-component>
            <button-component @click="onApplyFilter" size="medium" type="primary"> Apply </button-component>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';

export default {
    name: 'InboxFilter',
    props: {
        modelValue: {
            type: [String, Number],
            default: '',
        },
    },
    components: {
        IconComponent,
        ButtonComponent,
    },
    emits: ['applyFilter','close'],
    setup(props, { emit }) {
        const statusActive = ref('open');

        const onClose = () => {
            emit('close');
        };
        const onClickStatus = (value) => {
            statusActive.value = value;
        };

        const onApplyFilter = () => {
            emit('applyFilter', { status: statusActive.value });
            emit('close');
        };

        return { onClose, statusActive, onClickStatus, onApplyFilter };
    },
};
</script>

<style>
</style>