<template>
    <div
        class="box-group"
        :style="[
            {
                marginBottom: marginBottom + 'px',
            },
        ]"
    >
        <div class="box-avatar-group">
            <avatar-component
                v-if="listMessage[0].sender_type === constants.SENT_BY.USER"
                :labelShow="false"
                size="small"
                :label-avatar="listMessage[0].username"
                :image="listMessage[0].avatar_src"
                :bgAvatar="listMessage[0].avatar_bg"
                :online="3"
                :userRemoved="listMessage[0].user_removed"
                class="avatar-message"
            />
        </div>
        <div class="box-message-group">
            <template v-for="(mgs, key) in listMessage" :key="key">
                <MessageDetailSingle
                    :message="mgs"
                    :position="mgs.sender_type !== constants.SENT_BY.CUSTOMER ? 'left' : 'right'"
                    :background="mgs.sender_type !== constants.SENT_BY.CUSTOMER ? '#F6F6F8' : '#3E6DDA'"
                    :textColor="mgs.sender_type !== constants.SENT_BY.CUSTOMER ? '#141417' : '#ffffff'"
                    :showAvatar="false"
                    :marginBottom="'2'"
                    :borderRadius="
                        borderRadius(
                            key + 1,
                            listMessage.length,
                            mgs.sender_type,
                            listMessage[key - 1],
                            listMessage[key + 1],
                        )
                    "
                    :type="'group'"
                    :scroll="scroll"
                ></MessageDetailSingle>
            </template>
        </div>
    </div>
</template>

<script>
import { computed, toRefs } from 'vue';
import MessageDetailSingle from './MessageDetailSingle.vue';
import AvatarComponent from '../WidgetAvatar.vue';
import constants from '../../constants/constants';

export default {
    name: 'MessageDetailGroup',
    props: {
        message: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        marginBottom: {
            type: String,
            default: '24',
        },
        scroll: {
            type: Number,
            default: 0,
        },
    },
    components: { MessageDetailSingle, AvatarComponent },
    setup(props) {
        const { message } = toRefs(props);

        const listMessage = computed(() => {
            return message.value;
        });

        const borderRadius = (index, count, senderType, preMessage, nextMessage) => {
            if (senderType == constants.SENT_BY.CUSTOMER) {
                if (
                    (index == 1 &&
                        (nextMessage.type === constants.MESSAGE_TYPE.IMAGE || nextMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        nextMessage.status !== constants.STATUS.DELETED) ||
                    (index == count &&
                        (preMessage.type === constants.MESSAGE_TYPE.IMAGE || preMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        preMessage.status !== constants.STATUS.DELETED) ||
                    (nextMessage &&
                        preMessage &&
                        preMessage.status !== constants.STATUS.DELETED &&
                        nextMessage.status !== constants.STATUS.DELETED &&
                        (preMessage.type === constants.MESSAGE_TYPE.IMAGE || preMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        (nextMessage.type === constants.MESSAGE_TYPE.IMAGE || nextMessage.type === constants.MESSAGE_TYPE.FILE))
                )
                    return '20px';
                if (
                    index == 1 ||
                    (nextMessage &&
                        preMessage &&
                        (preMessage.type === constants.MESSAGE_TYPE.IMAGE || preMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        preMessage.status !== constants.STATUS.DELETED)
                )
                    return '20px 20px 4px 20px';
                if (
                    index == count ||
                    (nextMessage &&
                        (nextMessage.type === constants.MESSAGE_TYPE.IMAGE || nextMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        nextMessage.status !== constants.STATUS.DELETED)
                )
                    return '20px 4px 20px 20px';
                return '20px 4px 4px 20px';
            } else {
                if (
                    (index == 1 &&
                        (nextMessage.type === constants.MESSAGE_TYPE.IMAGE || nextMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        nextMessage.status !== constants.STATUS.DELETED) ||
                    (index == count &&
                        (preMessage.type === constants.MESSAGE_TYPE.IMAGE || preMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        preMessage.status !== constants.STATUS.DELETED) ||
                    (nextMessage &&
                        preMessage &&
                        preMessage.status !== constants.STATUS.DELETED &&
                        nextMessage.status !== constants.STATUS.DELETED &&
                        (preMessage.type === constants.MESSAGE_TYPE.IMAGE || preMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        (nextMessage.type === constants.MESSAGE_TYPE.IMAGE || nextMessage.type === constants.MESSAGE_TYPE.FILE))
                )
                    return '20px';
                if (
                    index == 1 ||
                    (nextMessage &&
                        preMessage &&
                        (preMessage.type === constants.MESSAGE_TYPE.IMAGE || preMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        preMessage.status !== constants.STATUS.DELETED)
                )
                    return '20px 20px 20px 4px';
                if (
                    index == count ||
                    (nextMessage &&
                        (nextMessage.type === constants.MESSAGE_TYPE.IMAGE || nextMessage.type === constants.MESSAGE_TYPE.FILE) &&
                        nextMessage.status !== constants.STATUS.DELETED)
                )
                    return '4px 20px 20px 20px';
                return '4px 20px 20px 4px';
            }
        };

        return {
            listMessage,
            borderRadius,
            constants,
        };
    },
};
</script>
<style lang="scss" scoped>
.box-group {
    margin-bottom: 24px;
    display: flex;

    .box-message-group {
        width: calc(100% - 40px);
    }
    .box-avatar-group {
        width: 40px;
        align-self: flex-end;

        .avatar-message {
            margin-right: 8px;
            margin-bottom: 4px;
        }
    }
}
</style>
