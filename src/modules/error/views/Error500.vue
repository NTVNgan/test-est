<template>
    <ErrorPage500 :srcImg="'images/500.svg'">
        <template v-slot:title>
            <h2>{{ $t('error.title_error500') }}</h2>
        </template>
        <template v-slot:body>
            <p class="text-14 text-neutrals-400">{{$t('error.subtitle_error500')}}</p>
            <p class="text-14 text-neutrals-400">{{$t('error.subtitle_error500_1')}}
                <router-link class="text-primary-500" :to="{ name: 'ContactSample' }">{{ $t('error.btn_error500') }}</router-link>
            </p>
        </template>
    </ErrorPage500>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ErrorPage500 from '../components/Error.vue';
// import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Error500',
    components: {
        ErrorPage500,
    },
    // setup() {
    //     const route = useRoute();
    //     console.log(route)
    //     return { 
    //         route
    //     };
    // },
});
</script>
