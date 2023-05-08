<template>
    <p class="h-40 my-24p text-14" v-html="$t('contact.contact_import_modal_attribute_mapping_description')"></p>
    <template v-if="dataUploadSync.data && dataUploadSync.data.length">
        <lazy-load class="h-308">
            <div class="h-308 relative">
                <div
                    @scroll="onScrollSectionAttrMapping"
                    class="whitespace-nowrap h-full relative overflow-x-auto scrollbar"
                >
                    <div
                        v-for="(data, data_index) in dataUploadSync.data"
                        :key="`col-${data_index}`"
                        class="h-256 w-218 inline-block rounded-4p border border-neutrals-100"
                        :class="{ 'ml-8p': data_index > 0 }"
                    >
                        <div class="p-4p bg-neutrals-100">
                            <dropdown-attribute
                                :listAttrSelected="getListAttrSelected"
                                v-model:modelValue="data.attribute_id"
                            />
                        </div>
                        <div class="h-24 py-4p px-12p text-center bg-neutrals-100 text-12 text-neutrals-400">
                            {{ data.column }}
                        </div>
                        <div
                            class="h-36 py-8p px-12p bg-white text-14 text-neutrals-800 font-medium border-b border-neutrals-100"
                        >
                            <p class="overflow-hidden">{{ data.header }}</p>
                        </div>
                        <div
                            class="h-36 py-8p px-12p bg-white text-14 text-neutrals-400 border-b border-neutrals-100 overflow-hidden"
                            v-for="item in data.value"
                            :key="item"
                        >
                            <p class="overflow-hidden">{{ item }}</p>
                        </div>
                    </div>
                </div>
                <template v-if="dataUploadSync.total > 4">
                    <div class="faded__element"></div>
                    <div
                        class="slider__title text-12 text-neutrals-400"
                        v-html="
                            $t(
                                `contact.contact_import_modal_attribute_mapping_more_${
                                    dataUploadSync.total - 4 > 1 ? 'rows' : 'row'
                                }`,
                                {
                                    row_quantity: filters.formatNumberWithCommas(dataUploadSync.total - 4),
                                },
                            )
                        "
                    ></div>
                </template>
            </div>
            <template #loading>
                <attribute-mapping-skeleton />
            </template>
        </lazy-load>
    </template>
    <template v-else>
        <div class="h-308 pt-40p">
            <img class="logo mx-auto w-120 h-120" src="../../images/import-empty.svg" alt="img" />
            <div class="text-center">
                <p class="text-16 font-bold">
                    {{ $t('contact.contact_import_modal_attribute_mapping_empty_title') }}
                </p>
                <p class="text-14 text-neutrals-400">
                    {{ $t('contact.contact_import_modal_attribute_mapping_empty_subtitle') }}
                </p>
            </div>
        </div>
    </template>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import LazyLoad from '@/components/LazyLoad.vue';
import DropdownAttribute from './ContactListModalImportContactDropdownAttribute.vue';
import AttributeMappingSkeleton from './ContactListModalImportContactAttributeMappingSkeleton.vue';
import filters from '@/utils/filters';

export default defineComponent({
    name: 'ContactListModalImportContactAttributeMapping',
    props: {
        dataUpload: {
            type: Object,
            default: null,
        },
    },
    components: {
        LazyLoad,
        DropdownAttribute,
        AttributeMappingSkeleton,
    },
    setup(props, { emit }) {
        const emitter: any = inject('emitter');
        const dataUploadSync = computed({
            get(): any {
                return props.dataUpload;
            },
            set(value: any) {
                emit('update:dataUpload', value);
            },
        });
        const getListAttrSelected = computed(() => {
            return dataUploadSync.value.data.map((item: any) => {
                return item.attribute_id;
            });
        });
        const onScrollSectionAttrMapping = () => {
            emitter.emit('listAttrMappingScroll');
        };

        return {
            onScrollSectionAttrMapping,
            dataUploadSync,
            getListAttrSelected,
            filters,
        };
    },
});
</script>

<style lang="scss" scoped>
.whitespace-nowrap {
    white-space: nowrap;
}
.slider__title {
    position: absolute;
    top: 260px;
    left: 50%;
    transform: translateX(-50%);
}
.faded__element {
    position: absolute;
    top: 200px;
    left: 0;
    width: 100%;
    height: 56px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 71.87%);
    border-radius: 0px 0px 4px 4px;
}
:deep(.dropdown-component) {
    width: 100%;
}
</style>
