<template>
    <div>
        <slot v-if="shouldShow" />
        <div v-else>
            <slot name="loading"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            shouldShow: false,
        };
    },
    mounted() {
        const opt = {
                root: null,
                rootMargin: '0px',
                threshold: 0,
            },
            observer = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting) {
                        return;
                    }
                    observer.unobserve(this.$el);
                    this.shouldShow = true;
                });
            }, opt);
        observer.observe(this.$el);
    },
});
</script>
