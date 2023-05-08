<template>
    <div class="p-10">
        <table-component
            :columns="columns"
            :data-source="data"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            keyData="name"
        >
            <template v-slot:nameTitle>
                <icon-component class="inline-block mr-8p" name="caret-down"></icon-component>
                <span>Name</span>
            </template>

            <template v-slot:name="{ record }">
                <div class="flex">
                    <avatar-component
                        :label-show="false"
                        size="medium"
                        label-avatar="Oluwayemisi Eun-Jung"
                        class-component="mr-16p"
                        :image="record.image"
                    />
                    <div class="inline-block flex flex-col text-14p">
                        <span>{{ record.name }}</span>
                        <span class="font-normal">{{ record.email }}</span>
                    </div>
                </div>
            </template>

            <template v-slot:status="{ record }">
                <tag-component class="bg-red" v-model="record.role" />
            </template>

            <template v-slot:action1>
                <button-component type="link">Link</button-component>
            </template>

            <template v-slot:action2>
                <icon-component class="inline-block" name="trash"></icon-component>
            </template>

            <template v-slot:footer>
                <div class="flex justify-between items-center">
                    <span class="font-normal text-14">Showing 5 of 15 results</span>
                    <pagination-comp type="link" />
                </div>
            </template>
        </table-component>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import TagComponent from '@/components/ui/TagComponent.vue';
import TableComponent from '@/components/ui/TableComponent.vue';
import PaginationComp from '@/components/ui/PaginationComponent.vue';

const dummyColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        slots: {
            title: 'nameTitle',
        },
        scopedSlots: { customRender: 'name' },
        width: '30%',
    },
    {
        title: 'Title',
        dataIndex: 'title',
        scopedSlots: { customRender: 'title' },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' },
    },
    {
        title: 'Role',
        dataIndex: 'role',
        scopedSlots: { customRender: 'role' },
    },
    {
        key: 'action1',
        scopedSlots: { customRender: 'action1' },
        width: '6%',
    },
    {
        key: 'action2',
        scopedSlots: { customRender: 'action2' },
        width: '4%',
    },
];

const dummyData = [
    {
        name: 'Adele',
        title: 'Regional Paradigm Technician',
        department: 'Optimization',
        role: 'Admin',
        email: 'jane.cooper@example.com',
        image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        name: 'Sam Smith',
        title: 'Regional Paradigm Technician',
        department: 'Optimization',
        role: 'Admin',
        email: 'jane.cooper@example.com',
        image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        name: 'Radiohead',
        title: 'Regional Paradigm Technician',
        department: 'Optimization',
        role: 'Admin',
        email: 'jane.cooper@example.com',
        image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        name: 'Frank Sinatra',
        title: 'Regional Paradigm Technician',
        department: 'Optimization',
        role: 'Admin',
        email: 'jane.cooper@example.com',
        image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
];

export default defineComponent({
    name: 'DSTable',
    components: {
        ButtonComponent,
        IconComponent,
        TableComponent,
        PaginationComp,
        TagComponent,
        AvatarComponent,
    },
    setup() {
        const columns = ref(dummyColumns);
        const data = ref(dummyData);
        const selectedRowKeys = ref<Array<any>>([]);

        const onSelectChange = (selectedRowKeysChange: Array<any>) => {
            console.log('selectedRowKeys changed: ', selectedRowKeysChange);
            selectedRowKeys.value = selectedRowKeysChange;
        };

        return {
            columns,
            data,
            selectedRowKeys,
            onSelectChange,
        };
    },
});
</script>

<style lang="scss" scoped></style>
