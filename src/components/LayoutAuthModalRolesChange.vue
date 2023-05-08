<template>
    <modal-component :closeIcon="false" v-model="showModalSync">
        <template v-slot:body>
            <div class="flex flex-col items-center">
                <img src="@/assets/images/roles-change.svg" alt="" />
                <span class="font-bold text-24 mt-16p">Role changes</span>
                <div class="text-14 px-88p text-center mt-16p">
                    Your role has changed to <b>{{role}}.</b> <br />
                    Please login again.
                </div>
                <div class="flex justify-end mt-16p">
                    <button-component @click="onLogout" size="medium"> Login </button-component>
                </div>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useAuth } from '../modules/auth/composables/useAuth';
import { computed, onMounted, ref } from 'vue';
export default {
    name: 'LayoutAuthModalRolesChange',
    components: {
        ButtonComponent,
        ModalComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            default: null,
        },
    },
    setup(props: any, { emit }: any) {
        const { logout } = useAuth();
        const timer = ref<any>(null);

        onMounted(() => {
            timer.value = setTimeout(logout, 6000);
        });

        const onLogout = () => {
            clearTimeout(timer.value);
            logout();
        };

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        return {
            showModalSync,
            onLogout,
        };
    },
};
</script>

<style>
</style>