<template>
    <div class="p-10p">
        <button-component @click="add" class="mr-6p">
            <span> Toast width button </span>
        </button-component>
        <button-component @click="addBasic" class="mr-6p">
            <span> Toast Basic </span>
        </button-component>
        <button-component @click="addError">
            <span> Error </span>
        </button-component>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'Toast',
    components: {
        ButtonComponent,
    },
    setup() {
        const { addToast } = useToast();
        const addMoreToast = () => {
            addToast({
                title: 'Another Toast Demo Test',
                type: 'basic',
                icon: 'WifiSlash',
                iconColor: 'neutrals-400',
                timeout: 10000,
                btnLabel: 'Add more',
                btnFunction: addMoreToast,
            });
        };
        const add = () => {
            addToast({
                title: 'Message sent',
                icon: 'Wifi',
                iconColor: 'success-3',
                type: 'basic',
                timeout: 50000,
                btnLabel: 'Undo',
                btnFunction: addMoreToast,
            });
        };
        const addBasic = () => {
            addToast({
                title: 'Message sent',
                type: 'basic',
                timeout: 40000,
            });
        };
        const addError = () => {
            addToast({
                title: 'Error text',
                type: 'error',
                timeout: 30000,
            });
        };
        return {
            addMoreToast,
            add,
            addBasic,
            addError,
        };
    },
});
</script>
