<template>
    <div class="relative h-full flex-1 flex bg-white lg:text-center shadow-deep-1 rounded-l-8p relative">
        <div class="relative top-30% w-full justify-self-center	">
            <img class="img-default mx-auto" src="@/modules/inbox/images/Illustration.png" />
            <div class="content-text text-center">
                <span class="text-16 font-bold">{{ $t('inbox.inbox_no_data_title') }}</span>
                <p class="text-14 font-normal text-des">
                    {{ $t('inbox.inbox_no_data_des1') }} <br />
                    {{ $t('inbox.inbox_no_data_des2') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'InboxNoData',
    components: {},

    setup() {
        return {};
    },
});
</script>

<style lang="scss" scoped>
.box-content-nodata {

    img {
        margin: 0 auto;
    }
    .text-des {
        color: #828292;
    }
    span {
        line-height: 35px;
    }
}
</style>
