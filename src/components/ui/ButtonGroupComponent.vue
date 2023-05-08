<template>
    <div :class="type">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        type: {
            type: String,
            default: 'default',
        },
    },
});
</script>

<style lang="scss" scoped>
div {
    display: flex;
}
.default {
    :deep(button) {
        border-radius: 4px;
    }
    :deep(button):not(:last-child) {
        margin-right: 4px;
    }
}
.segmented {
    :deep(button):first-child {
        border-radius: 4px 0px 0px 4px;
    }
    :deep(button):last-child {
        border-radius: 0px 4px 4px 0px;
    }
    :deep(button):not(:first-child):not(:last-child) {
        border-radius: 0;
    }
    :deep(button):not(:last-child) {
        margin-right: 2px;
    }
    :deep(button):first-child:nth-last-child(2),
    :deep(button):first-child:nth-last-child(2) ~ button {
        border-radius: 2px;
    }
}
</style>
