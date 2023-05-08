<template>
    <div class="content-notification mb-24p text-center" :class="isDate ? 'date-log-widget' : ''">
        <span class="inline-block" v-html="content"> </span>
    </div>
</template>

<script >
import { computed, toRefs } from 'vue';

export default {
    name: 'MessageNotification',
    props: {
        contentArr: {
            type: Array,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: [],
        },
        isDate: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const { contentArr } = toRefs(props);

        const content = computed(() => {
            if (!contentArr.value || contentArr.value.length < 1) return '';
            let msg = '';
            contentArr.value.forEach(content => {
                if (!content.bold) msg = msg + ' ' + content.text;
                else msg = msg + ' <b>' + content.text + '</b>';
            });
            return msg;
        });

        return {
            content,
        };
    },
};
</script>
<style lang="scss" scoped>
.content-notification span {
    width: auto;
}
.content-notification {
    font-size: 12px;
    line-height: 16px;
    color: #828292;
    margin-bottom: 24px;
}
.text-center {
    text-align: center;
}
.inline-block {
    display: inline-block;
}
</style>
<style lang='scss'>
.linebase-widget {
    .date-log-widget span b {
        font-weight: 500;
    }
}
</style>
