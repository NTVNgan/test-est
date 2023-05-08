<template>
    <div class="text-center bg-white absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center">
        <Spinner />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Spinner from '@/components/ui/Spinner.vue';

export default defineComponent({
    name: 'AuthLoadingScreen',
    components: {
        Spinner,
    },
});
</script>
