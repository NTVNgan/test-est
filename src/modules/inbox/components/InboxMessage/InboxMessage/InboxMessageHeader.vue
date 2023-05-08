<template>
    <button-component
        v-if="
            conversationDetail.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED ||
                conversationDetail.status === CONSTANTS.CONVERSATION_STATUS.ACTIVATED
        "
        type="secondary"
        size="small"
        class="message-btn-resolve-reopen"
        :disabled="checkDisableBtn"
        @click="clickBtnResolveOrReopen"
    >
        <IconComponent
            :name="conversationDetail.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED ? 'inbox-out' : 'check'"
            :color="checkDisableBtn ? 'neutrals-300' : 'neutrals-900'"
        />
        <span class="ml-4p font-medium text-14">
            {{
                conversationDetail.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED
                    ? $t('inbox.inbox_reopen')
                    : $t('inbox.inbox_resolve')
            }}
        </span>
    </button-component>
</template>

<script>
import IconComponent from '@/components/ui/IconComponent.vue';
import { computed } from 'vue';
import CONSTANTS from '@/modules/inbox/constants/constants';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { store } from '@/store';
import { useContact } from '@/modules/contact/composables/useContact';
import { useInboxConversation } from '@/modules/inbox/composables/useInboxConversation';
import { useInboxPushingHandler } from '@/modules/inbox/composables/useInboxPushingHandler';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { inject, watch, ref } from 'vue';
import { useInboxGroup } from '@/modules/inbox/composables/useInboxGroup';

export default {
    name: 'InboxMessageHeader',
    components: {
        IconComponent,
        ButtonComponent,
    },
    props: {
        conversationDetail: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        hoverActive: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const { contact } = useContact();
        const { updateStatusConversation, handlePushRouterAfterChangeStatusConvo } = useInboxConversation();
        const { resetCacheConvoResolveAndReopen } = useInboxPushingHandler();
        const { addToast } = useToast();
        const { t } = useI18n();
        const emitter = inject('emitter');
        const isContactBlockOrArchived = ref(false);
        const { getGroups } = useInboxGroup();

        const clickBtnResolveOrReopen = async () => {
            resetCacheConvoResolveAndReopen();
            let action = CONSTANTS.CONVERSATION_STATUS.ACTIVATED;
            if (props.conversationDetail.status !== CONSTANTS.CONVERSATION_STATUS.RESOLVED)
                action = CONSTANTS.CONVERSATION_STATUS.RESOLVED;
            await updateStatusConversation({ status: action }, props.conversationDetail._id);
            if (action === CONSTANTS.CONVERSATION_STATUS.ACTIVATED) {
                await handlePushRouterAfterChangeStatusConvo(props.conversationDetail);
                await new Promise(resolve => setTimeout(resolve, 100));
                await getGroups();
            } else {
                addToast({
                    title: t('inbox.inbox_toast_convo_resolve_success'),
                    type: 'basic',
                    timeout: 3000,
                });
            }
        };

        const currentUser = computed(() => {
            return store.state.auth.user;
        });

        const checkDisableBtn = computed(() => {
            if (isContactBlockOrArchived.value) return true;
            if (!contact.value || typeof contact.value.status === 'undefined') return true;
            if (
                contact.value.status === CONSTANTS.CONTACT_STATUS.ARCHIVED ||
                contact.value.status === CONSTANTS.CONTACT_STATUS.BLOCK
            ) {
                return true;
            }
            if (props.conversationDetail.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) return false;
            const assignUser = props.conversationDetail.participants.filter(p => p.parti_type === 1);
            if (assignUser.length < 1) return false;
            else return assignUser[0]['parti_id'] !== currentUser.value._id;
        });

        emitter.on('changeStatusContact', data => {
            if (
                contact.value._id === data.contact_id &&
                (data.contact_status === CONSTANTS.CONTACT_STATUS.ARCHIVED ||
                    data.contact_status === CONSTANTS.CONTACT_STATUS.BLOCK ||
                    data.status < 0)
            ) {
                isContactBlockOrArchived.value = true;
            } else isContactBlockOrArchived.value = false;
        });

        watch(
            () => contact.value,
            (newVal, oldVal) => {
                if (newVal && oldVal && newVal._id !== oldVal._id) isContactBlockOrArchived.value = false;
            },
        );

        return {
            clickBtnResolveOrReopen,
            CONSTANTS,
            checkDisableBtn,
        };
    },
};
</script>
<style lang="scss" scoped>
.message-btn-resolve-reopen {
    background-color: #fff;
    padding-left: 11px;
    padding-right: 11px;
    border: 1px solid #e9e9ec;
    border-radius: 4px;
}
</style>
