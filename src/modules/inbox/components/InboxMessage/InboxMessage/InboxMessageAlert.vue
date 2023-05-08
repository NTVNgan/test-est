<template>
    <div class="alert-in-message">
        <template v-if="cacheConvoResolveAndReopen.length > 0 && showAlertResolveAndReopen">
            <template v-for="(convo, key) in cacheConvoResolveAndReopen" :key="key">
                <Alert
                    v-if="convo.convo_id === conversationDetail._id && convo.action === 'someone_resolve'"
                    class="alert-item"
                    :type="'success'"
                    :primary="'Label'"
                    :secondary="'Label'"
                    @closeAlert="clickCloseAlertResolveAndReopen"
                >
                    <template v-slot:message>
                        <p>{{ convo.action === 'someone_resolve' ? $t('inbox.inbox_alert_convo_resolved') : '' }}</p>
                    </template>
                </Alert>
                <Alert
                    v-if="convo.convo_id === conversationDetail._id && convo.action === 'someone_reopen'"
                    class="alert-item"
                    :type="'warning'"
                    :primary="'Label'"
                    :secondary="'Label'"
                    :name-icon="'exclamation-circle'"
                    @closeAlert="clickCloseAlertResolveAndReopen"
                >
                    <template v-slot:message>
                        <p>{{ $t('inbox.inbox_alert_convo_reopen') }}</p>
                    </template>
                </Alert>
            </template>
        </template>
        <template v-if="checkConvoRemoved && showAlertChangedConvo">
            <Alert
                class="alert-item"
                :type="'warning'"
                :primary="'Label'"
                :secondary="'Label'"
                :name-icon="'exclamation-circle'"
                @closeAlert="clickAlertConvoChanged"
            >
                <template v-slot:message>
                    <p>{{ $t('inbox.inbox_conversation_changed') }}</p>
                </template>
            </Alert>
        </template>
        <template v-if="checkCustomerOnlineStatus">
            <Alert
                class="alert-item"
                :type="statusOnlineCustomer === 'online' ? 'success' : 'warning'"
                :primary="'Label'"
                :secondary="'Label'"
                :name-icon="statusOnlineCustomer === 'online' ? 'CheckCircle' : 'exclamation-circle'"
                @closeAlert="clickAlertCustomerOnlineStatus"
            >
                <template v-slot:message>
                    <p>
                        {{
                            statusOnlineCustomer === 'online'
                                ? $t('inbox.inbox_alert_status_customer_online')
                                : $t('inbox.inbox_alert_status_customer_offline')
                        }}
                    </p>
                </template>
            </Alert>
        </template>
    </div>
</template>

<script>
import { ref } from 'vue';
import Alert from '@/components/ui/AlertComponent.vue';
import { useInboxPushingHandler } from '../../../composables/useInboxPushingHandler';

export default {
    name: 'InboxMessageAlert',
    components: {
        Alert,
    },
    props: {
        conversationDetail: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        checkConvoRemoved: {
            type: Boolean,
            default: false,
        },
        showAlertChangedConvo: {
            type: Boolean,
            default: false,
        },
        checkCustomerOnlineStatus: {
            type: Boolean,
            default: false,
        },
        statusOnlineCustomer: {
            type: String,
            default: 'online',
        },
    },
    emits: ['closeAlertConvoChanged', 'closeAlertCustomerOnlineStatus'],
    setup(props, { emit }) {
        const { cacheConvoResolveAndReopen } = useInboxPushingHandler();
        const showAlertResolveAndReopen = ref(true);

        const clickAlertConvoChanged = () => {
            emit('closeAlertConvoChanged');
        };
        const clickCloseAlertResolveAndReopen = () => {
            showAlertResolveAndReopen.value = false;
        };
        const clickAlertCustomerOnlineStatus = () => {
            emit('closeAlertCustomerOnlineStatus');
        };

        return {
            clickAlertConvoChanged,
            clickAlertCustomerOnlineStatus,
            clickCloseAlertResolveAndReopen,
            cacheConvoResolveAndReopen,
            showAlertResolveAndReopen,
        };
    },
};
</script>
<style lang="scss" scoped>
.alert-in-message {
    position: absolute;
    bottom: 0;
    z-index: 10;
    left: 24px;
    right: 24px;
    overflow: hidden;

    ::v-deep(.alert-item) {
        margin-bottom: 12px;
    }

    ::v-deep(.content-alert) {
        margin-top: 2px;
    }

    ::v-deep(.flex-shrink-0) {
        height: 22px;
    }

    ::v-deep(.ml-auto) {
        height: 22px;
    }
}
</style>
