<template>
    <div class="flex justify-around">
        <pagination type="link" :total="99" v-model="pagValLink" />
        <pagination type="button" :total="10" v-model="pagValNum" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Pagination from '@/components/ui/PaginationComponent.vue';

export default defineComponent({
    name: 'DSPagination',
    data() {
        return {
            pagValLink: 1,
            pagValNum: 1,
        };
    },
    components: {
        Pagination,
    },
});
</script>
