<template>
    <div v-if="countSegmentCustom > 0 && !showSkeleton">
        <ContactListConfigSegment
            class="right-16p mr-16p float-right"
            @change="updateShowHideSegment"
            @updateShowHide="updateShowHide"
        >
            <template v-slot:default>
                <button-component
                    @click="clickBtnToolSegment"
                    type="subtle"
                    icon="tools"
                    isFocus
                    class="bg-neutrals-100"
                />
            </template>
        </ContactListConfigSegment>
        <div class="sub-menu-segment pt-40p mb-20p pl-16p" ref="submenu">
            <span class="text-12 font-normal text-subtle-1"
                >Showing {{ countSegmentCustomShow }} of {{ countSegmentCustom }}
                {{ countSegmentCustom == 1 ? 'segment' : 'segments' }}</span
            >
            <div
                class="overflow-y-auto flex-auto box-content scrollbar--transparent mt-8p pr-16p"
                @scroll="handleScrollToBottom"
                v-if="routeSegmentCustomList.length > 0"
            >
                <div
                    v-for="(item, index) in routeSegmentCustomList"
                    class="relative w-max w-inherit"
                    :key="`submenu-${index}`"
                >
                    <router-link
                        :to="{ name: 'ContactListBySegment', params: item.params }"
                        class="flex
                            items-center
                            px-16p
                            py-10p
                            mb-8p
                            rounded-4p
                            text-14 text-neutrals-700
                            hover:bg-neutrals-100
                            transition
                            duration-300
                            ease-in-out"
                        role="menuitem"
                        :active-class="
                            typeof item.submenu !== undefined && typeof item.expand !== undefined && item.expand
                                ? ''
                                : 'bg-neutrals-100'
                        "
                        v-slot="{ isExactActive, isActive }"
                    >
                        <span
                            class="flex-auto truncate "
                            :class="{ 'font-bold text-primary-500': isExactActive || isActive }"
                        >
                            {{ item.label }}
                        </span>
                        <span class="flex-none ml-16p" :class="{ 'text-primary-500': isExactActive || isActive }">
                            {{ item.count.toLocaleString() }}
                        </span>
                    </router-link>
                </div>
                <div v-if="loading" class="loading">
                    <Spinner size="small" color="#3E6DDA" />
                </div>
            </div>
        </div>
    </div>
    <ContactListSegmentSkeleton v-if="showSkeleton" />
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ContactListConfigSegment from './ContactListConfigSegment.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { useSegment } from '@/modules/contact/composables/useSegment';
import { store } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import ContactListSegmentSkeleton from '../components/ContactListSegmentSkeleton.vue';

export default {
    name: 'ContactListSegmentCustom',
    props: {},
    components: {
        ButtonComponent,
        ContactListConfigSegment,
        Spinner,
        ContactListSegmentSkeleton,
    },
    setup() {
        const openDropdown = ref(false);
        const loading = ref<boolean>(false);
        const {
            getListSegmentCustom,
            routeSegmentCustomList,
            countSegmentCustom,
            countSegmentCustomShow,
            nextPage,
            segmentsCustom,
            getSegmentById,
            segments,
            showSkeleton,
        } = useSegment();
        const user = computed(() => store.state.auth.user);
        const { _id: user_id } = user.value;
        const route = useRoute();
        const router = useRouter();

        const updateShowHideSegment = (data: any) => {
            console.log('data', data);
        };

        const handleScrollToBottom = async (target: any) => {
            if (nextPage.value == '' || nextPage.value == null || nextPage.value == 'null') return;
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                loading.value = true;
                await getListSegmentCustom(false);
                loading.value = false;
            }
        };

        const clickBtnToolSegment = async () => {
            openDropdown.value = true;
        };

        const callSegmentCustom = async () => {
            await getListSegmentCustom(true);
        };

        const checkSegmentHide = async () => {
            const segmentById = await getSegmentById(route.params.segmentId);
            if (segmentById) {
                if (segmentById.hide_for_users.includes(user_id)) {
                    const findSegment = segments.value.find(s => s.name === 'All');
                    let selectSegment = { _id: '' };
                    if (findSegment) selectSegment = findSegment;
                    if (segmentsCustom.value.length > 0) selectSegment = segmentsCustom.value[0];
                    await router.replace({
                        name: 'ContactListBySegment',
                        params: {
                            segmentId: selectSegment._id,
                        },
                    });
                }
            }
        };

        const updateShowHide = async () => {
            await getListSegmentCustom(true);
            await checkSegmentHide();
        };

        onMounted(() => {
            callSegmentCustom();
        });

        onUnmounted(() => {
            nextPage.value = '';
            segmentsCustom.value = [];
        });

        return {
            openDropdown,
            updateShowHideSegment,
            handleScrollToBottom,
            nextPage,
            loading,
            clickBtnToolSegment,
            routeSegmentCustomList,
            countSegmentCustom,
            updateShowHide,
            segmentsCustom,
            countSegmentCustomShow,
            showSkeleton,
        };
    },
};
</script>
<style scoped>
.contact-list :deep(.submenu__wrapper) {
    height: auto;
    flex: inherit;
}
.box-content {
    height: calc(100vh - 53px - 280px - 56px - 32px - 20px);
}
.loading {
    height: 36px;
    width: 100%;
    text-align: center;
}
.sub-menu-segment .scrollbar--transparent::-webkit-scrollbar-thumb {
    border: 4px solid #f6f6f8;
}
</style>
