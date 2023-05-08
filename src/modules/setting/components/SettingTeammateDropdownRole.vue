<template>
    <Dropdown>
        <template #header>
            <div ref="dropdownButtonEl" class="flex items-center py-4p pl-8p pr-4p -mr-4p" @click="toggleDropdown">
                <span
                    class="w-44 mr-8p truncate text-right"
                    :class="showDropdown ? 'font-medium text-primary-500' : 'text-neutrals-900'"
                >
                    {{ roleName }}
                </span>
                <icon-component name="chevronDown" :color="showDropdown ? 'primary-500' : 'neutrals-900'" />
            </div>
        </template>
        <template #list>
            <teleport to="#select">
                <div
                    ref="dropdownEl"
                    v-click-outside-teleport="hideDropdown"
                    v-if="showDropdown"
                    :style="{
                        right: dropdownRight !== 'auto' ? `${dropdownRight}px` : dropdownRight,
                        left: dropdownLeft !== 'auto' ? `${dropdownLeft}px` : dropdownLeft,
                        top: dropdownTop !== 'auto' ? `${dropdownTop}px` : dropdownTop,
                        bottom: dropdownBottom !== 'auto' ? `${dropdownBottom}px` : dropdownBottom,
                    }"
                    class="fixed z-999 bg-white text-14 font-body rounded-4p shadow-deep-1"
                >
                    <list-component v-model="valueSync" class="pb-0">
                        <list-item-component
                            type="default-blue"
                            v-for="(item, index) in roleList"
                            :key="'role-' + index"
                            :value="item._id"
                        >
                            <span>{{ $t(`common.role_${item.name.toLowerCase()}`) }}</span>
                            <template #decription>
                                <span>{{ $t(`common.role_description_${item.name.toLowerCase()}`) }}</span>
                            </template>
                        </list-item-component>
                    </list-component>
                </div>
            </teleport>
        </template>
    </Dropdown>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Dropdown from '@/components/ui/DropdownComponent.vue';
import ListComponent from '@/components/ui/ListComponent.vue';
import ListItemComponent from '@/components/ui/ListItemComponent.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'SettingTeammateDropdownRole',
    components: {
        IconComponent,
        Dropdown,
        ListComponent,
        ListItemComponent,
    },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        roleList: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        const dropdownEl = ref<HTMLElement>();
        const dropdownButtonEl = ref<HTMLElement>();
        const dropdownRight = ref<number | string>('auto');
        const dropdownLeft = ref<number | string>('auto');
        const dropdownTop = ref<number | string>('auto');
        const dropdownBottom = ref<number | string>('auto');
        const showDropdown = ref<boolean>(false);
        const { t } = useI18n();

        const valueSync = computed({
            get(): string {
                return props.modelValue;
            },
            set(value: string) {
                emit('update:modelValue', value);
            },
        });
        const roleName = computed(() => {
            if (props.roleList) {
                const findRole: any = props.roleList.find((item: any) => item._id === valueSync.value);
                if (findRole) {
                    return t(`common.role_${findRole.name.toLowerCase()}`);
                }
            }
            return '';
        });
        const setPositionDropdown = () => {
            if (dropdownEl.value && dropdownButtonEl.value) {
                const rangeBottomToScreen = window.innerHeight - dropdownButtonEl.value.getBoundingClientRect().bottom;
                dropdownLeft.value =
                    dropdownButtonEl.value.getBoundingClientRect().right - dropdownEl.value.offsetWidth;
                if (rangeBottomToScreen < dropdownEl.value.getBoundingClientRect().height) {
                    dropdownTop.value = 'auto';
                    dropdownBottom.value = dropdownButtonEl.value.getBoundingClientRect().top;
                } else {
                    dropdownTop.value = dropdownButtonEl.value.getBoundingClientRect().bottom;
                    dropdownBottom.value = 'auto';
                }
            }
        };
        const toggleDropdown = async () => {
            showDropdown.value = !showDropdown.value;
            await nextTick();
            setPositionDropdown();
        };
        const hideDropdown = () => {
            showDropdown.value = false;
        };

        watch(
            () => props.modelValue,
            () => {
                hideDropdown();
            },
        );

        return {
            dropdownEl,
            dropdownButtonEl,
            dropdownRight,
            dropdownLeft,
            dropdownTop,
            dropdownBottom,
            showDropdown,
            toggleDropdown,
            hideDropdown,
            valueSync,
            roleName,
        };
    },
});
</script>

<style lang="scss" scoped>
.pb-0 {
    padding: 0px;
}
</style>
