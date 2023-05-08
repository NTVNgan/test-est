<template>
    <div v-if="hoverActive && message.status !== CONSTANTS.STATUS.DELETED" class="tool-message flex">
        <span
            v-if="message.sender_type === CONSTANTS.SENT_BY.USER"
            @click="clickDelete"
            class="icon-trash flex items-center px-6p py-6p hover:bg-neutrals-50 cursor-pointer"
        >
            <icon-component name="Trash" color="neutrals-400" />
        </span>
        <tooltip-component
            v-if="checkShowTagBtn"
            class="inline-block"
            type="dark"
            position="top"
            content="Tag this message"
            label="Tooltip"
        >
            <span
                @click="clickTag"
                class="ml-2p mr-2p flex items-center px-6p py-6p hover:bg-neutrals-50 cursor-pointer"
            >
                <icon-component name="Tag" color="neutrals-400" />
            </span>
        </tooltip-component>
    </div>
</template>

<script>
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { computed } from 'vue';
import CONSTANTS from '@/modules/inbox/constants/constants';

export default {
    name: 'MessageSingleTool',
    components: {
        TooltipComponent,
        IconComponent,
    },
    props: {
        message: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        hoverActive: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['clickDeleteMessage', 'clickTagMessage'],
    setup(props, { emit }) {
        const clickDelete = () => {
            emit('clickDeleteMessage');
        };
        const clickTag = () => {
            emit('clickTagMessage');
        };
        const checkShowTagBtn = computed(() => {
            if (props.message.type === CONSTANTS.MESSAGE_TYPE.EMAIL) return false;
            return !(
                (props.message.type === CONSTANTS.MESSAGE_TYPE.IMAGE ||
                    props.message.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                props.message.images.length > 0
            );
        });
        return {
            clickDelete,
            clickTag,
            checkShowTagBtn,
            CONSTANTS,
        };
    },
};
</script>
<style lang="scss" scoped>
.box-message-single :deep(.tooltip-component) {
    width: auto;
}

.avatar-message {
    overflow: initial;

    :deep(.avatar-content) {
        bottom: 4px;
    }
}

.box-message-single.right {
    text-align: right;
}

.box-message-single.single {
    display: flex;

    .box-tooltip-message {
        width: auto;
    }
}

.box-tooltip-message :deep(.inline-block) {
    display: inline-block;
}

.m-h-360 {
    max-height: 360px;
}

.box-message-single {
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;

    .icon-email-message {
        :deep(svg) {
            color: #fff0;
        }

        :deep(.icon-error) {
            path {
                stroke: #f29f8f;
            }
        }
    }

    .list-tag-message {
        max-width: 392px;
        background: #e2ecff;
        border-radius: 20px;
        padding: 2px 12px 10px 16px;
        text-align: left;
        margin-top: -10px;
        display: inline-block;
    }

    .message-deleted {
        padding-top: 9px;
        padding-bottom: 9px;
    }

    .tool-message {
        span {
            border-radius: 4px;
        }
    }

    .mgs-note {
        border: 1px solid #ffd466;
    }

    .tooltip-component {
        display: inline-block;
    }
}
</style>
