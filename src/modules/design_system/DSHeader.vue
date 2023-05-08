<template>
    <div class="p-20p">
        <HeaderComponent>
            <button-component class="header__noti ml-auto mr-6p" size="small" type="subtle" icon="bell" />
            <dropdown-component v-click-outside="hideInfo">
                <template v-slot:header>
                    <button
                        @click="toggleInfo"
                        class="h-36 w-36 p-2p rounded-50% hover:bg-neutrals-50 focus:bg-neutrals-100 focus:outline-none"
                    >
                        <avatar-component size="small" label-avatar="Oluwayemisi Eun-Jung" />
                    </button>
                </template>
                <template v-slot:list>
                    <div
                        class="w-244 absolute top-100 right-0 z-999 rounded-4p shadow-deep-1 bg-white focus:outline-none"
                        role="none"
                        v-if="showInfo"
                    >
                        <div class="p-16p border-b">
                            <avatar-component :labelShow="true" size="small" label-avatar="Oluwayemisi Eun-Jung" />
                        </div>
                        <div class="pl-8p pr-16p pt-14p pb-8p">
                            <router-link
                                :to="{ name: 'ProfileAccountDetail' }"
                                class="flex items-center outline-none item block px-12p py-8p text-14 text-neutrals-900 rounded border border-primary-transparent hover:bg-neutrals-50"
                                role="menuitem"
                                @click="showInfo = false"
                            >
                                <icon-component class="mr-12p" name="person" color="neutrals-500" />
                                Your account
                            </router-link>
                            <a
                                class="flex items-center outline-none item block px-12p py-8p text-14 text-primary-500 rounded border border-primary-transparent hover:bg-neutrals-50"
                                role="menuitem"
                                @click="logout"
                            >
                                <icon-component class="mr-12p" name="sign-out" color="primary-500" />
                                Log out
                            </a>
                        </div>
                    </div>
                </template>
            </dropdown-component>
        </HeaderComponent>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '@/modules/auth/composables/useAuth';
import HeaderComponent from '@/components/ui/HeaderComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import DropdownComponent from '@/components/ui/DropdownComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
export default defineComponent({
    components: {
        HeaderComponent,
        ButtonComponent,
        AvatarComponent,
        DropdownComponent,
        IconComponent,
    },
    setup() {
        const { logout, error, loading } = useAuth();
        const showInfo = ref(false);
        const toggleInfo = () => {
            showInfo.value = !showInfo.value;
        };
        const hideInfo = () => {
            showInfo.value = false;
        };
        return {
            logout,
            showInfo,
            toggleInfo,
            hideInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
.header__noti {
    :deep(svg) {
        fill: #6b6b7b !important;
    }
}
</style>
