<template>
    <ErrorPage404 :srcImg="'images/404.svg'">
        <template v-slot:title>
            <h2>{{ $t('error.title_error404') }}</h2>
        </template>
        <template v-slot:body>
            <p class="text-14 text-neutrals-400">
                {{ $t('error.subtitle_error404') }}
                <router-link class="text-primary-500" :to="{ name: 'SignIn' }">{{ $t('error.btn_error404') }}</router-link>
            </p>
        </template>
    </ErrorPage404>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ErrorPage404 from '../components/Error.vue';
// import { useRoute } from 'vue-router';
import { routerPush } from '@/router';

export default defineComponent({
    name: 'Error404',
    components: {
        ErrorPage404,
    },
    created: function() {
        // Redirect outside the app using plain old javascript
        routerPush('Error404');
    }
    // setup() {
    //     const route = useRoute();
    //     console.log(route)
    //     return { 
    //         route
    //     };
    // },
});
</script>
