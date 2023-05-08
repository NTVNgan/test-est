<template>
    <div class="h-480 flex flex-col items-center justify-center">
        <img class="logo mx-auto w-120 h-120" src="../../images/import-success.svg" alt="img" />
        <div class="text-center">
            <p class="text-16 font-bold mb-16p">
                {{ $t('contact.contact_import_modal_finish_title') }}
            </p>
            <p class="text-14" v-html="$t('contact.contact_import_modal_finish_subtitle')"></p>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch } from 'vue';

export default defineComponent({
    name: 'ContactListModalImportContactFinish',
    props: {},
    components: {},
    setup(props, { emit }) {
        return {};
    },
});
</script>

<style lang="scss" scoped>
ul {
    li {
        position: relative;
        padding-left: 20px;
        &:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #000000;
        }
    }
}
</style>
