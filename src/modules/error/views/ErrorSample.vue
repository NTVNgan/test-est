<template>
    <ErrorSample :srcImg="'images/error.svg'">
        <template v-slot:title>
            <h2>{{ $t('error.title_error_sample') }}</h2>
        </template>
        <template v-slot:body>
            <p class="text-14 text-neutrals-400">
                {{ $t('error.subtitle_error_sample') }}
            </p>
            <span class="text-14 text-neutrals-400 font-bold block">{{ $t('error.id_error_sample') }} 1234321</span>
            <router-link class="text-14 inline-block bg-primary-500 rounded-4p font-medium text-white py-6p px-12p mt-24p" :to="{ name: 'ContactSample' }">{{ $t('error.btn_error_sample') }}</router-link>
        </template>
    </ErrorSample>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ErrorSample from '../components/Error.vue';

export default defineComponent({
    name: 'Error',
    components: {
        ErrorSample,
    },
});
</script>
