<template>
    <modal-component v-model="showModalSync">
        <template v-slot:header>
            <div class="flex">
                <icon-component class="mr-4p" name="InfoCircle" color="primary-600" />
                <span class="font-medium text-16">
                    You have unsaved changes
                </span>
            </div>
        </template>
        <template v-slot:body>
            <div class="text-center text-14 px-32p">
                Save your changes before leaving?
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <button-component type="outline" @click="leaveAnyway" class="mr-8p" size="medium">
                    Leave anyway
                </button-component>
                <button-component type="primary" size="medium" @click="save">
                    Save
                </button-component>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, reactive, computed } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'Article Unsave',
    components: {
        ModalComponent,
        ButtonComponent,
        IconComponent
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const { addToast } = useToast();

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const leaveAnyway = () => {
            emit('update:showModal', false);
            emit('discard', true);
            addToast({
                title: 'All changes are discarded',
                type: 'basic',
                timeout: 3000,
            });
        };

        const save = () => {
            emit('update:showModal', false);
            emit('saveArticle');
        }

        return {
            showModalSync,
            leaveAnyway,
            save
        }
    }
})
</script>