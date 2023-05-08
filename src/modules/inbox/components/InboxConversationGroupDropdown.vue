<template>
    <new-dropdown-component id="InboxConversationGroupDropdown" width="192px" v-model="show" :disabled="showSubmenu" position="bottom-right">
        <!-- {{ heading }} -->
        <p class="flex items-center font-medium text-14 font-body px-8p py-4p">
            <span :class="{ 'text-primary-500 font-medium': show }">{{ heading }}</span>
            <icon-comp
                class="ml-12p"
                name="angle-down"
                v-if="!showSubmenu"
                :color="show ? 'primary-500' : ''"
            ></icon-comp>
        </p>
        <template #content>
            <div class="p-8p">
                <router-link
                    v-for="(item, index) in routeGroup"
                    :to="{ name: item.name, params: item.params }"
                    :key="index"
                    @click="show = false"
                    class="
                        flex
                        justify-between
                        py-8p
                        px-12p
                        cursor-pointer
                        font-normal
                        text-14p
                        hover:text-primary-500
                        hover:font-medium
                    "
                    :class="{
                        'text-primary-500 font-medium': item.label === heading,
                    }"
                >
                    <span>{{ item.label }}</span>
                    <span>{{ item.count }}</span>
                </router-link>
            </div>
        </template>
    </new-dropdown-component>
</template>

<script>
import IconComp from '@/components/ui/IconComponent.vue';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import { ref, inject } from 'vue';
import { useInboxPushingHandler } from '../composables/useInboxPushingHandler';
export default {
    name: 'InboxConversationGroupDropdown',
    props: {
        heading: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        NewDropdownComponent,
        IconComp,
    },
    setup() {
        const { routeGroupList } = useInboxPushingHandler();
        const show = ref(false);
        const showSubmenu = inject('showSubmenu');
        return {
            show,
            showSubmenu,
            routeGroup: routeGroupList,
        };
    },
};
</script>

<style>
</style>