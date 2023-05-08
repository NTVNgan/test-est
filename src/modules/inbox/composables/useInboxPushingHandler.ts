import { computed, reactive, ref } from 'vue';
import { store } from '@/store';
import { useSocket } from '@/composables/useSocket';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from '@/modules/auth/composables/useUser';
import { useInboxGroup } from '@/modules/inbox/composables/useInboxGroup';
import { useInboxSocket } from '@/modules/inbox/composables/useInboxSocket';
import { useInboxGroupConversation } from '@/modules/inbox/composables/useInboxGroupConversations';
import { useI18n } from 'vue-i18n';
import CONTANTS from '../constants/constants.js';
import { routerPush } from '@/router';

interface ConvoDetailInterface {
    id: string;
    status: number;
    log: number;
    participants: Array<Record<string, any>>;
    last_message: Record<string, string>;
}
const { DELETED, ACTIVATED, RESOLVED } = CONTANTS.STATUS;
const { DONE, LEFT, MARKED, ASSIGNED, UNASSIGNED } = CONTANTS.LOG;
const { MESSAGE, LOG, ACTIVITY } = CONTANTS.GROUP;

const group = reactive<any>({
    resolved: 0,
    assign_to_you: 0,
    others: 0,
    unassign: 0,
    all: 0,
});

const addonConvo = ref<ConvoDetailInterface | null>(null);

const isOnGetNewConversations = ref<boolean>(false);
const isSocketUpdateConvo = ref<boolean>(true);
const mountedInbox = ref<boolean>(false);
const isPushRouteFromAnotherPage = ref<boolean>(true);
const cacheConvoRemove = ref({ id: '', group: '', groupPush: '', action: '' });
const incomingConversationCache = ref<ConvoDetailInterface[]>([]);
const messageConversationCache = ref<any>([]);
const cacheContentConvo = ref({ content: '', created_at: '', last_message: {} });
const cacheContentConvoHandleReOpen = ref({ _id: '', last_message: { content: '' } });
const cacheConvoResolveAndReopen = ref<any>([]);

export const useInboxPushingHandler = () => {
    const currUserId = computed(() => store.state.auth.user._id);
    const { conversations, updateStatusRead, noMessage } = useInboxGroupConversation({});
    const { inboxGroup } = useInboxGroup();
    const { userList } = useUser();
    const route = useRoute();
    const router = useRouter();
    const currGroup = computed(() => (route.params.name ? route.params.name : ''));
    const currConvoId = computed(() => (route.params.conversation ? route.params.conversation : ''));
    const currConvo = computed<ConvoDetailInterface>(() => conversations.value.find(u => u.id === currConvoId.value));
    const { socket } = useSocket();
    const { isCallImcomingConversation } = useInboxSocket();

    const { t } = useI18n();
    const titleGroup = reactive<any>({
        assign_to_you: t('inbox.inbox_group_name_base'),
        unassign: t('inbox.inbox_group_name_unassigned'),
        all: t('inbox.inbox_group_name_all'),
    });

    const routeGroupList = computed(() => {
        const result: any[] = [];
        inboxGroup.value.forEach(s => {
            let label;
            let sort_number;
            if (s.group in titleGroup) {
                label = titleGroup[s.group];
                sort_number = Object.values(titleGroup).findIndex((t: any) => t === titleGroup[s.group]);
                if (sort_number === -1) sort_number = 10;
            } else {
                label = s.group;
                sort_number = 20;
            }
            let countGroup = group[s.group];
            if (typeof group[s.group] === 'undefined') countGroup = 0;
            let countConvo = s.count + countGroup;
            if (router.currentRoute.value.name === 'InboxSearch') countConvo = s.count;
            result.push({
                label: label,
                name: 'InboxGroups',
                params: {
                    name: s.group,
                },
                count: countConvo,
                sort_number: sort_number,
            });
        });
        result.sort((a,b) => a.sort_number - b.sort_number)
        return result;
    });

    const resetCacheConvoRemove = () => {
        cacheConvoRemove.value = { id: '', group: '', groupPush: '', action: '' };
    };
    const resetCacheConvoResolveAndReopen = () => {
        cacheConvoResolveAndReopen.value = [];
    };

    const changeNumberGroup = (from: string, to: string) => {
        group[from]--;
        // group[to]++;
    };

    const pushNumberGroup = (groupName: string) => {
        group[groupName]++;
    };

    const mergeNumberGroupToActualGroup = () => {
        inboxGroup.value.forEach((groupItem: any, index) => {
            inboxGroup.value[index].count = groupItem.count + group[groupItem.group];
        });
        group.resolved = 0;
        group.assign_to_you = 0;
        group.others = 0;
        group.unassign = 0;
        group.all = 0;
    };

    const setAddonConvo = (convo: ConvoDetailInterface) => {
        addonConvo.value = convo;
        if (typeof convo.last_message.content != 'undefined') {
            cacheContentConvo.value.content = convo.last_message.content;
            cacheContentConvo.value.created_at = convo.last_message.created_at;
            cacheContentConvo.value.last_message = convo.last_message;
        }
    };
    const resetCacheContentConvo = () => {
        cacheContentConvo.value.content = '';
        cacheContentConvo.value.created_at = '';
        cacheContentConvo.value.last_message = {};
    };
    const setAddonConvoHandleReOpen = (convo: any) => {
        cacheContentConvoHandleReOpen.value = convo;
    };

    const pushAddonConvoHandleReOpen = async () => {
        if (cacheContentConvoHandleReOpen.value == undefined || cacheContentConvoHandleReOpen.value._id === '') return;
        await new Promise(resolve => setTimeout(resolve, 100));
        const findIndex = conversations.value.findIndex((convo: any) => convo._id === cacheContentConvoHandleReOpen.value._id)
        if (findIndex > -1) conversations.value.splice(findIndex, 1);
        conversations.value = [cacheContentConvoHandleReOpen.value, ...conversations.value];
        cacheContentConvoHandleReOpen.value = { _id: '', last_message: { content: '' } };
    };

    const resetgroup = () => {
        setTimeout(() => {
            group.resolved = 0;
            group.assign_to_you = 0;
            group.others = 0;
            group.unassign = 0;
            group.all = 0;
            addonConvo.value = null;
            isOnGetNewConversations.value = false;
            incomingConversationCache.value = [];
        }, 500);
    };

    const resetgroupNotSetimeout = () => {
        setTimeout(() => {
            group.resolved = 0;
            group.assign_to_you = 0;
            group.others = 0;
            group.unassign = 0;
            group.all = 0;
            addonConvo.value = null;
            isOnGetNewConversations.value = false;
            incomingConversationCache.value = [];
        }, 100);
    };

    // Check
    const detectConvoGroup = (convoDetail: ConvoDetailInterface) => {
        let convoGroup = '';
        if (convoDetail.status == RESOLVED) {
            // convoGroup = "done";
        } else {
            // find convoDetail.participants.ids with parti_type = 1; // 1: USER
            const userInConvo = convoDetail.participants.find(
                u => u.parti_id === currUserId.value && u.parti_type === 1,
            );
            if (!userInConvo) {
                convoGroup = 'unassign';
                if (router.currentRoute.value.params.name === 'all') convoGroup = 'all';
            } else {
                if (router.currentRoute.value.params.name === 'all') convoGroup = 'all';
                else {
                    // If current user is the user who participates in this convo, it's his
                    if (currUserId.value === userInConvo.parti_id) {
                        convoGroup = 'assign_to_you';
                    } else {
                        convoGroup = 'others'; // belongs to user_id in currUserList
                    }
                }
            }
        }
        return convoGroup;
    };

    const moveExistConvoToTopConversations = (convo: any = null) => {
        const convoInCurrentList = currConvo.value ? conversations.value.find(u => u.id === convo.id) : false;
        if (router.currentRoute.value.name === 'InboxSearch') {
            conversations.value.forEach(c => {
                if (c.id === convo.id) {
                    c.last_message = convo.last_message;
                    c.last_message_send_by_me =
                        convo.last_message.sender_type == CONTANTS.SENT_BY.USER &&
                        convo.last_message.sender_id == currUserId.value;
                    if (!c.last_message_send_by_me) {
                        updateStatusRead(convo.id, 'unread');
                    }
                }
            });
        } else {
            if (!convoInCurrentList) {
                // has no convo in this current list
                // --> APPEND this convo to the top of this group list

                if (
                    (currGroup.value == 'unassign' && convo.last_message.sender_id == currUserId.value) ||
                    convo.last_message.is_new_convo
                ) {
                    convo.last_message_send_by_me =
                        convo.last_message.sender_type == CONTANTS.SENT_BY.USER &&
                        convo.last_message.sender_id == currUserId.value;
                    if (!convo.last_message.is_new_convo) updateStatusRead(convo.id, 'read');
                    if (convo.last_message.group === LOG) {
                        if (cacheContentConvo.value.content != '') {
                            convo.last_message.content = cacheContentConvo.value.content;
                            convo.last_message.created_at = cacheContentConvo.value.created_at;
                        } else if (Object.keys(cacheContentConvo.value.last_message).length !== 0) {
                            convo.last_message = cacheContentConvo.value.last_message;
                        }
                    }
                    resetCacheContentConvo();
                    conversations.value = [convo, ...conversations.value];
                } else if (currGroup.value != 'unassign') {
                    convo.last_message_send_by_me =
                        convo.last_message.sender_type == CONTANTS.SENT_BY.USER &&
                        convo.last_message.sender_id == currUserId.value;
                    if (!convo.last_message.is_new_convo) updateStatusRead(convo.id, 'read');
                    conversations.value = [convo, ...conversations.value];
                } else if (
                    currGroup.value == 'unassign' &&
                    convo.last_message.sender_id != currUserId.value &&
                    convo.event_convo_type == 'toggle' &&
                    convo.status == 1
                ) {
                    convo.last_message_send_by_me =
                        convo.last_message.sender_type == CONTANTS.SENT_BY.USER &&
                        convo.last_message.sender_id == currUserId.value;

                    if (convo.last_message.group === LOG && cacheContentConvo.value.content != '') {
                        convo.last_message.content = cacheContentConvo.value.content;
                        convo.last_message.created_at = cacheContentConvo.value.created_at;
                    }
                    convo.isSeen = true;
                    resetCacheContentConvo();
                    conversations.value = [convo, ...conversations.value];
                }
            } else {
                if (convo.last_message.group === MESSAGE) convoInCurrentList.last_message = convo.last_message;
                convoInCurrentList.last_message_send_by_me =
                    convo.last_message.sender_type == CONTANTS.SENT_BY.USER &&
                    convo.last_message.sender_id == currUserId.value;
                if (!convoInCurrentList.last_message_send_by_me && convo.status != -1) {
                    updateStatusRead(convo.id, 'unread');
                }
                conversations.value = conversations.value.filter(u => u.id !== convoInCurrentList.id);
                conversations.value = [convoInCurrentList, ...conversations.value];
                // --> MOVE this convo to top of this group list
            }
        }
    };

    const updateConvo = (convoDetail: ConvoDetailInterface) => {
        const convoGroup: string = detectConvoGroup(convoDetail);
        /**
         * Calculate total
         */
        const actor: string = convoDetail.last_message.sender_id; // who did the action
        const recipient: string = convoDetail.last_message.content;
        const logType = Number(convoDetail.last_message.type);
        if (convoDetail.status === RESOLVED) {
            group.resolved++;
            if (currUserId.value === actor) {
                // left || done
                group.assign_to_you--;
            } else {
                group.others--;
            }
        } else {
            // Check if the event contains a message "log"
            if (convoDetail.last_message.group == LOG.toString()) {
                if (logType === ASSIGNED) {
                    // Assign
                    if (currUserId.value === recipient) {
                        // Someone assigns to YourChat
                        console.log('updateConvo plus');
                        group.assign_to_you++;
                    } else {
                        if (currUserId.value === actor) {
                            // You assign to someone from UnassignedGroup
                            group.unassign--;
                        } else {
                            // Someone1: state.value.group.others--; // Someone1 assigns to someone2 from HisChat
                            // someone2: state.value.group.others++;
                        }
                    }
                } else {
                    if (logType === UNASSIGNED) {
                        // Unassign
                        if (currUserId.value === recipient) {
                            // Someone unassigns this from YourChat
                            console.log('Calculate total not Resolved sub assign to you');
                            group.assign_to_you--;
                        } else {
                            if (currUserId.value === actor) {
                                // You unassign(left) this from you to UnassignedGroup
                                console.log('Calculate total not Resolved plus unassigne');
                                group.unassign++;
                            } else {
                                // someone2: state.value.group.others--; // Someone1 unassigns this from someone2
                                // someone2: state.value.group.others--; // Someone1 unassigns this from HisChat
                            }
                        }
                    }
                }
            } else {
                if (convoDetail.last_message.is_new_convo) {
                    group['unassign']++;
                    group['all']++;
                }
            }
        }

        /**
         * Realtime jumping
         */
        if (router.currentRoute.value.name === 'InboxSearch') {
            if (Number(convoDetail.last_message.group) === MESSAGE) {
                moveExistConvoToTopConversations(convoDetail);
            }
        } else {
            if (currGroup.value === convoGroup && Number(convoDetail.last_message.group) === MESSAGE) {
                moveExistConvoToTopConversations(convoDetail);
            }
        }
    };

    const handleIncomingConversation = (data: ConvoDetailInterface | any, countable = true) => {
        const convoGroup = detectConvoGroup(data);
        if (addonConvo.value && addonConvo.value.id === data.id && data.last_message.group === LOG) {
            // data.last_message = addonConvo.value.last_message;
            data.last_message.content = addonConvo.value.last_message.content;
            data.last_message.created_at = addonConvo.value.last_message.created_at;
            data.last_message_send_by_me = true;
            if (!isOnGetNewConversations.value) addonConvo.value = null;
        }
        if (countable) {
            if (currConvoId.value !== data.id) updateConvo(data);
            else {
                if (currGroup.value === convoGroup && data.last_message.sender_type === CONTANTS.SENT_BY.CUSTOMER) {
                    moveExistConvoToTopConversations(data);
                } else {
                    if (currGroup.value === convoGroup || data.last_message.group === MESSAGE) {
                        moveExistConvoToTopConversations(data);
                    }
                    // Calculate total
                    if (data.last_message.group === LOG) {
                        if (convoGroup === 'assign_to_you') {
                            group.assign_to_you++;
                        } else {
                            if (convoGroup === 'unassign') {
                                group.unassign++;
                            }
                            if (convoGroup === 'others') {
                                group.others++;
                            }
                        }
                    }
                }
                if (data.last_message.group === LOG && data.last_message.content == currUserId.value) {
                    // if (data.type == ASSIGNED)
                    const tempCurrConvo = currConvo.value;
                    if (data.last_message.type == ASSIGNED && currGroup.value === 'unassign') {
                        setAddonConvo(tempCurrConvo);
                        routerPush('InboxGroups', { name: 'assign_to_you', conversation: currConvoId.value });
                        group.unassign--;
                    }
                    if (data.last_message.type == UNASSIGNED && currGroup.value === 'assign_to_you') {
                        setAddonConvo(tempCurrConvo);
                        routerPush('InboxGroups', { name: 'unassign', conversation: currConvoId.value });
                        group.assign_to_you--;
                    }
                }
            }
        }
        // }
    };
    
    const setDataCacheConvoRemove = (id: any, groupName: any, groupPush = '', action = '') => {
        cacheConvoRemove.value.id = id;
        cacheConvoRemove.value.group = groupName;
        cacheConvoRemove.value.groupPush = groupPush;
        cacheConvoRemove.value.action = action;
    };

    const onListUnAssignIncomingConversation = (data: any, groupName: any, findIndex: any) => {
        const convoInCurrentList = conversations.value.filter(u => u.id === currConvoId.value);
        if (groupName === 'assign_to_you') {
            if (data.id != currConvoId.value) {
                if (findIndex > -1) conversations.value.splice(findIndex, 1);
                if (conversations.value.length < 1) noMessage.value = true;
                group.unassign++;
                if (
                    typeof data.previous_assigned_user_id != undefined &&
                    data.previous_assigned_user_id == currUserId.value
                ) {
                    group.assign_to_you--;
                }
            } else {
                // convo opening
                if (convoInCurrentList.length > 0) {
                    setDataCacheConvoRemove(data.id, groupName, 'unassign');
                } else {
                    // convo không có sẵn trong list mà đc chuyển qua unassign
                    group.unassign++;
                }
            }
        } else if (groupName === 'all') {
            group.unassign++;
            if (
                typeof data.previous_assigned_user_id != undefined &&
                data.previous_assigned_user_id == currUserId.value
            ) {
                group.assign_to_you--;
            }
            if (convoInCurrentList.length > 0) {
                setDataCacheConvoRemove(data.id, groupName, 'unassign', 'handleInGroupAll');
            }
        } else {
            if (groupName === 'unassign' && findIndex < 0) {
                group.unassign++;
                const newConvo = data;
                newConvo.isSeen = newConvo.last_message.sender_type == CONTANTS.SENT_BY.USER;
                newConvo.last_message_send_by_me =
                    newConvo.last_message.sender_id == currUserId.value &&
                    newConvo.last_message.sender_type == CONTANTS.SENT_BY.USER;
                if (
                    newConvo.last_message.group == CONTANTS.GROUP.LOG &&
                    typeof newConvo.last_human_message != undefined
                )
                    newConvo.last_message = newConvo.last_human_message;
                conversations.value = [newConvo, ...conversations.value];
                if (
                    typeof data.previous_assigned_user_id != undefined &&
                    data.previous_assigned_user_id == currUserId.value
                ) {
                    group.assign_to_you--;
                }
            }
            if (groupName === 'unassign' && findIndex > -1) {
                resetCacheConvoRemove();
            }
        }
    };

    const onListAssignToYouIncomingConversation = (data: any, groupName: any, findIndex: any, newAssignUser: any) => {
        if (newAssignUser[0].parti_id != currUserId.value) {
            // handle user cuop convo
            // opening convo?
            if (data.id != currConvoId.value) {
                // const findIndex = conversations.value.findIndex(c => c.id === data.id);
                if (findIndex > -1) conversations.value.splice(findIndex, 1);
                if (conversations.value.length < 1) noMessage.value = true;
                if (typeof data.previous_assigned_user_id != undefined && data.previous_assigned_user_id == null)
                    group.unassign--;
            } else {
                // opening convo
                if (groupName !== 'all') {
                    if (findIndex < 0) group.unassign--;
                    setDataCacheConvoRemove(data.id, groupName, '');
                } else {
                    setDataCacheConvoRemove(data.id, groupName, '', 'handleInGroupAll');
                    if (typeof data.previous_assigned_user_id != undefined && data.previous_assigned_user_id == null)
                        group.unassign--;
                }
            }
        } else {
            // user assign convo, handle push convo to top list
            if (groupName === 'assign_to_you' && findIndex < 0) {
                group.assign_to_you++;
                if (typeof data.previous_assigned_user_id != undefined && data.previous_assigned_user_id == null)
                    group.unassign--;
                const newConvo = data;
                newConvo.isSeen = newConvo.last_message.sender_type == CONTANTS.SENT_BY.USER;
                newConvo.last_message_send_by_me =
                    newConvo.last_message.sender_id == currUserId.value &&
                    newConvo.last_message.sender_type == CONTANTS.SENT_BY.USER;
                if (
                    newConvo.last_message.group == CONTANTS.GROUP.LOG &&
                    typeof newConvo.last_human_message != undefined
                )
                    newConvo.last_message = newConvo.last_human_message;
                conversations.value = [newConvo, ...conversations.value];
            } else if (groupName === 'assign_to_you' && findIndex > -1) {
                if (typeof data.previous_assigned_user_id != undefined && data.previous_assigned_user_id == null) {
                    if (data.id != currConvoId.value || cacheConvoRemove.value.id != currConvoId.value) {
                        group.unassign--;
                    }
                }
                if (
                    typeof data.previous_assigned_user_id != undefined &&
                    data.previous_assigned_user_id == null &&
                    data.id == currConvoId.value &&
                    cacheConvoRemove.value.id !== currConvoId.value
                ) {
                    // case convoA của user 1, user 2 dô => none , user 1 lại lấy convoA => lỗi
                    group.assign_to_you++;
                }
                resetCacheConvoRemove();
            } else if (groupName === 'unassign' && findIndex > -1) {
                conversations.value.splice(findIndex, 1);
                group.unassign--;
                group.assign_to_you++;
            } else if (groupName === 'unassign' && findIndex < 0) {
                console.log('di do đây hả-------------');
            } else if (groupName === 'all') {
                group.assign_to_you++;
                if (typeof data.previous_assigned_user_id != undefined && data.previous_assigned_user_id == null) {
                    group.unassign--;
                }
            }
        }
    };
    const updateLastMessageInCacheConvoResolveOrReopen = (newDataConvo: any) => {
        if (cacheContentConvoHandleReOpen.value == undefined || cacheContentConvoHandleReOpen.value._id === '') return;
        if (cacheContentConvoHandleReOpen.value._id === newDataConvo.id) {
            cacheContentConvoHandleReOpen.value.last_message = newDataConvo.last_message;
        }
    };

    const onListenIncomingConversation = (data: any, groupName: any) => {
        console.log('IncomingConversation--------------', data);
        if (!isSocketUpdateConvo.value || data.last_message.is_new_convo || data.last_message.group == CONTANTS.GROUP.MESSAGE) {
            // handle in 1 user
            if (data.event_convo_type == 'toggle') {
                const convoInCurrentList = currConvo.value ? conversations.value.find(u => u.id === data.id) : false;
                if (!convoInCurrentList) {
                    if (data.status == 1) {
                        if (!data.assigned) group.unassign++;
                        else group.assign_to_you++;
                    } else if (data.status == -1) {
                        if (!data.assigned) group.unassign--;
                        else group.assign_to_you--;
                    }
                }
            }
            updateLastMessageInCacheConvoResolveOrReopen(data);
            if (isOnGetNewConversations.value) {
                incomingConversationCache.value.push(data);
            } else handleIncomingConversation(data);
        } else {
            if (data.last_message.group == CONTANTS.GROUP.LOG && isSocketUpdateConvo.value && mountedInbox.value) {
                // handle multiple user
                const newAssignUser = data.participants.filter((p: any) => p.parti_type === 1);
                const findIndex = conversations.value.findIndex(c => c.id === data.id);
                if (newAssignUser.length < 1) {
                    onListUnAssignIncomingConversation(data, groupName, findIndex);
                } else {
                    onListAssignToYouIncomingConversation(data, groupName, findIndex, newAssignUser);
                }
            }
        }
        isSocketUpdateConvo.value = true;
    };
    const onListenIncomingConversationPageSearch = (data: any) => {
        console.log('IncomingConversation page search--------------', data);
        if (data.last_message.group == CONTANTS.GROUP.MESSAGE) {
            updateLastMessageInCacheConvoResolveOrReopen(data);
            if (isOnGetNewConversations.value) {
                incomingConversationCache.value.push(data);
            } else handleIncomingConversation(data);
        } else {
            if (data.last_message.group == CONTANTS.GROUP.LOG) {
                const newAssignUser = data.participants.filter((p: any) => p.parti_type === 1);
                if (newAssignUser.length < 1) {
                    // unassign
                    if (data.status !== CONTANTS.CONVERSATION_STATUS.RESOLVED) {
                        if (typeof data.previous_assigned_user_id != undefined &&
                            data.previous_assigned_user_id !== null && data.previous_assigned_user_id === currUserId.value)
                            group.assign_to_you--;

                        group.unassign++;
                    }
                } else {
                    // check assign to you
                    if (typeof data.previous_assigned_user_id != undefined && data.previous_assigned_user_id == null) {
                        group.unassign--;
                    }
                    if (newAssignUser[0].parti_id === currUserId.value) group.assign_to_you++;
                }
            }
        }
        mergeNumberGroupToActualGroup();
    };

    const checkAddonConvo = () => {
        if (addonConvo.value) {
            moveExistConvoToTopConversations(addonConvo.value);
            addonConvo.value = null;
        }
    };

    const checkIncomingConversationCache = () => {
        if (incomingConversationCache.value.length > 0) {
            incomingConversationCache.value.forEach((data: any) => {
                handleIncomingConversation(data, isPushRouteFromAnotherPage.value);
            });
            incomingConversationCache.value = [];
            addonConvo.value = null;
        }
        // checkAddonConvo()
        isOnGetNewConversations.value = false;
        isPushRouteFromAnotherPage.value = true;
    };

    return {
        updateConvo,
        onListenIncomingConversation,
        group,
        routeGroupList,
        moveExistConvoToTopConversations,
        setAddonConvo,
        setAddonConvoHandleReOpen,
        checkAddonConvo,
        addonConvo,
        changeNumberGroup,
        resetgroup,
        currConvo,
        isPushRouteFromAnotherPage,
        isOnGetNewConversations,
        incomingConversationCache,
        messageConversationCache,
        checkIncomingConversationCache,
        detectConvoGroup,
        mergeNumberGroupToActualGroup,
        isSocketUpdateConvo,
        cacheConvoRemove,
        resetCacheConvoRemove,
        pushNumberGroup,
        mountedInbox,
        resetgroupNotSetimeout,
        cacheConvoResolveAndReopen,
        cacheContentConvoHandleReOpen,
        pushAddonConvoHandleReOpen,
        resetCacheConvoResolveAndReopen,
        onListenIncomingConversationPageSearch,
    };
};
