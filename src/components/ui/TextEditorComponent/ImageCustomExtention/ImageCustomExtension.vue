<template>
    <node-view-wrapper class="vue-component">
        <span class="label" contenteditable="false">Vue Component</span>
        <node-view-content class="content" />
    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3';

export default {
    components: {
        NodeViewWrapper,
        NodeViewContent,
    },

    props: nodeViewProps,
};
</script>
