<template>
    <drawer-component v-model="showDrawerSync">
        <template #header>
            <span class="flex items-center">
                <icon-component class="mr-4p" name="filter" color="primary-500" />
                {{ $t('contact.contact_filter_drawer_title') }}
            </span>
        </template>
        <template #body>
            <filter-component
                v-model:filters="filtersClone"
                :filtersValue="attributesList"
                :showDrawerSync="showDrawerSync"
            />
        </template>
        <template #footer>
            <div class="flex justify-end">
                <button-component
                    v-if="checkShowClearAllButton"
                    size="medium"
                    type="destructive-link"
                    class="mr-auto"
                    @click="clearAllFilter"
                >
                    {{ $t('contact.contact_filter_drawer_button_clear') }}
                </button-component>
                <button-component
                    :disabled="checkDisableApplyButton"
                    size="medium"
                    type="primary"
                    @click="submitFilter"
                >
                    {{ $t('contact.contact_filter_drawer_button_apply') }}
                </button-component>
            </div>
        </template>
    </drawer-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import DrawerComponent from '@/components/ui/DrawerComponent.vue';
import FilterComponent from '@/components/ui/FilterComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'ContactListDrawerFilter',
    props: {
        showDrawer: {
            type: Boolean,
            default: false,
        },
        filters: {
            type: Object,
            default: null,
        },
    },
    components: {
        ButtonComponent,
        DrawerComponent,
        FilterComponent,
        IconComponent,
    },
    setup(props, { emit }) {
        const filtersClone = ref<any>(JSON.parse(JSON.stringify(props.filters)));
        const attributes: any = inject('attributesFilter');
        const showDrawerSync = computed({
            get(): boolean {
                return props.showDrawer;
            },
            set(value: boolean) {
                emit('update:showDrawer', value);
            },
        });
        const attributesList = computed(() => attributes.list.value);
        const checkShowClearAllButton = computed(() => {
            if (filtersClone.value !== null && filtersClone.value.groups.length) {
                return filtersClone.value.groups.length > 0;
            }
            return false;
        });
        const checkDisableApplyButton = computed(() => {
            if (filtersClone.value !== null && filtersClone.value.groups.length) {
                for (let index = 0; index < filtersClone.value.groups.length; index++) {
                    const filterGroups = filtersClone.value.groups[index];
                    const indexEmptyCondition = filterGroups.conditions.findIndex((item: any) => {
                        return Object.values(item)[0] === '';
                    });
                    if (indexEmptyCondition > -1) {
                        return true;
                    }
                }
            }
            return false;
        });

        const clearAllFilter = () => {
            filtersClone.value = {
                operator: 'AND',
                groups: [],
            };
        };
        
        const submitFilter = () => {
            if (filtersClone.value.groups.length === 0) {
                emit('submitFitler', null);
            } else {
                emit('submitFitler', filtersClone.value);
            }
            showDrawerSync.value = false;
        };
        watch(
            () => props.showDrawer,
            (newVal: boolean) => {
                if (newVal) {
                    filtersClone.value = JSON.parse(JSON.stringify(props.filters));
                }
            },
        );
        return {
            showDrawerSync,
            filtersClone,
            attributesList,
            submitFilter,
            clearAllFilter,
            checkDisableApplyButton,
            checkShowClearAllButton,
        };
    },
});
</script>

<style lang="scss" scoped></style>
