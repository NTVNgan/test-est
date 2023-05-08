<template>
    <div :class="checkLastSeenInGroup ? 'has-read-receipt' : ''">
        <div
            class="box-group"
            :style="[
                {
                    marginBottom: marginBottom + 'px',
                },
            ]"
        >
            <div class="box-message-group">
                <template v-for="(mgs, key) in listMessage" :key="key">
                    <InboxMessageDetailSingle
                        :message="mgs"
                        :position="mgs.sender_type === CONSTANTS.SENT_BY.CUSTOMER ? 'left' : 'right'"
                        :background="
                            mgs.sender_type === CONSTANTS.SENT_BY.CUSTOMER
                                ? 'bg-neutrals-100'
                                : mgs.is_whisper
                                ? 'bg-warning-5'
                                : 'bg-primary-50'
                        "
                        :textColor="mgs.sender_type === CONSTANTS.SENT_BY.CUSTOMER ? 'text-neutrals-900' : 'text-black'"
                        :showAvatar="false"
                        :marginBottom="'2'"
                        :borderRadius="
                            borderRadius(
                                key + 1,
                                listMessage.length,
                                mgs.sender_type,
                                listMessage[key - 1],
                                listMessage[key + 1],
                                mgs,
                            )
                        "
                        :type="'group'"
                    ></InboxMessageDetailSingle>
                </template>
            </div>
            <div class="box-avatar-group">
                <avatar-component
                    v-if="listMessage[0].sender_type === CONSTANTS.SENT_BY.USER"
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
        </div>
        <div class="read-receipt" v-if="listMessage[0].sender_type === CONSTANTS.SENT_BY.USER && checkLastSeenInGroup">
            <img class="logo mx-auto inline-block" src="../../images/check-seen.svg" alt="banner" />
            <span class="text-12">{{ $t('inbox.inbox_seen') }} {{ timeSeen }} </span>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, ref, toRefs } from 'vue';
import InboxMessageDetailSingle from '@/modules/inbox/components/InboxMessage/InboxMessageDetailSingle.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import CONSTANTS from '../../constants/constants';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import filters from '@/utils/filters';

export default {
    name: 'InboxMessageDetailGroup',
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
    },
    components: { InboxMessageDetailSingle, AvatarComponent },
    setup(props: any) {
        const { message } = toRefs(props);
        const timeCheck = ref(0);
        const { lastMessageSeenByCustomer, timeSeenLastMessage } = useInboxConversationDetail();
        const listMessage = computed(() => {
            return message.value;
        });

        const timeSeen = computed(() => {
            if (timeCheck.value > -1) return filters.formatTime(timeSeenLastMessage.value, false, true);
            return '';
        });

        const checkLastSeenInGroup = computed(() => {
            const checkInMessage = listMessage.value.filter((m: any) => m._id === lastMessageSeenByCustomer.value);
            return checkInMessage.length > 0;
        });

        const updateTimeSeen = () => {
            timeCheck.value++;
        };

        setInterval(updateTimeSeen, 60000);

        const borderRadius = (index: any, count: any, senderType: any, preMessage: any, nextMessage: any, mgs: any) => {
            if (mgs.is_whisper) return '4px';
            if (senderType == CONSTANTS.SENT_BY.USER) {
                if (
                    (index == 1 &&
                        (nextMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || nextMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        nextMessage.status !== CONSTANTS.STATUS.DELETED) ||
                    (index == count &&
                        (preMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || preMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        preMessage.status !== CONSTANTS.STATUS.DELETED) ||
                    (nextMessage &&
                        preMessage &&
                        preMessage.status !== CONSTANTS.STATUS.DELETED &&
                        nextMessage.status !== CONSTANTS.STATUS.DELETED &&
                        (preMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || preMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        (nextMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || nextMessage.type === CONSTANTS.MESSAGE_TYPE.FILE))
                )
                    return '20px';
                if (
                    index == 1 ||
                    (nextMessage &&
                        preMessage &&
                        (preMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || preMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        preMessage.status !== CONSTANTS.STATUS.DELETED)
                )
                    return '20px 20px 4px 20px';
                if (
                    index == count ||
                    (nextMessage &&
                        (nextMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || nextMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        nextMessage.status !== CONSTANTS.STATUS.DELETED)
                )
                    return '20px 4px 20px 20px';
                return '20px 4px 4px 20px';
            } else {
                if (
                    (index == 1 &&
                        (nextMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || nextMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        nextMessage.status !== CONSTANTS.STATUS.DELETED) ||
                    (index == count &&
                        (preMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || preMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        preMessage.status !== CONSTANTS.STATUS.DELETED) ||
                    (nextMessage &&
                        preMessage &&
                        preMessage.status !== CONSTANTS.STATUS.DELETED &&
                        nextMessage.status !== CONSTANTS.STATUS.DELETED &&
                        (preMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || preMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        (nextMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || nextMessage.type === CONSTANTS.MESSAGE_TYPE.FILE))
                )
                    return '20px';
                if (
                    index == 1 ||
                    (nextMessage &&
                        preMessage &&
                        (preMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || preMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        preMessage.status !== CONSTANTS.STATUS.DELETED)
                )
                    return '20px 20px 20px 4px';
                if (
                    index == count ||
                    (nextMessage &&
                        (nextMessage.type === CONSTANTS.MESSAGE_TYPE.IMAGE || nextMessage.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                        nextMessage.status !== CONSTANTS.STATUS.DELETED)
                )
                    return '4px 20px 20px 20px';
                return '4px 20px 20px 4px';
            }
        };

        return {
            listMessage,
            borderRadius,
            CONSTANTS,
            lastMessageSeenByCustomer,
            timeSeen,
            checkLastSeenInGroup,
        };
    },
};
</script>
<style lang="scss" scoped>
.has-read-receipt .box-group {
    margin-bottom: 2px !important;
}
.box-group {
    display: flex;

    .box-message-group {
        width: calc(100% - 40px);
    }
    .box-avatar-group {
        width: 40px;
        align-self: flex-end;

        .avatar-message {
            margin-left: 8px;
            margin-bottom: 4px;

            &::v-deep img {
                width: 100%;
                object-fit: cover;
            }
        }
    }
}
.read-receipt {
    text-align: right;
    margin-right: 40px;
    color: #00c850;
    line-height: 16px;
    margin-bottom: 12px;

    img {
        margin-right: 8px;
        image-rendering: pixelated;
    }
}
</style>
