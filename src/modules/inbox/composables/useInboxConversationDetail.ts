import { computed, ref } from 'vue';
import { services } from '@/modules/inbox/services';
import CONSTANTS from '@/modules/inbox/constants/constants';
import filters from '@/utils/filters';
import { useUser } from '@/modules/auth/composables/useUser';
import { store } from '@/store';
import { useI18n } from 'vue-i18n';
import { useInboxPushingHandler } from '@/modules/inbox/composables/useInboxPushingHandler';
import { useInboxGroupConversation } from '@/modules/inbox/composables/useInboxGroupConversations';
import { AxiosResponse } from 'axios';

const messages = ref({});
const showIndicatorNewMessage = ref(false);
const countNewMessage = ref(0);
const conversationSelected = ref({ _id: '', assigned: false, id: '' });
const lastMessageSeenByCustomer = ref('');
const idFakeNewMessage = ref('');
const timeSeenLastMessage = ref();
const conversationDetail = ref({ _id: '', participants: [{ parti_type: 1, parti_id: '' }], tags: [], status: 1 });
const userTyping = ref<any>({});

export const useInboxConversationDetail = () => {
    const nextPage = ref<string>('');
    const conversationId = ref<string>('');
    const { t } = useI18n();
    const { userList, getUserById } = useUser();
    const { messageConversationCache } = useInboxPushingHandler();
    const { noMessage, conversations } = useInboxGroupConversation({});
    const currentUser = computed(() => store.state.auth.user);

    const findUserById = async (userId: any) => {
        try {
            if (userId == null) return '';
            const user = await userList.value.filter(u => u._id == userId);
            if (user.length > 0) {
                return user[0];
            } else {
                const userData = await getUserById(userId);
                if (userData == undefined) return '';
                userList.value.push(userData);
                return userData;
            }
        } catch (e) {
            return {
                avatar_bg: '',
                avatar_src: 'no-user.png',
                created_at: '',
                email: '',
                first_name: '',
                full_name: '',
                last_name: 'null',
                username: userId,
                user_removed: true,
            };
        }
    };

    const findUserNameById = async (userId: any) => {
        if (userId == null) return '';
        const user = await findUserById(userId);
        return user.username;
    };

    const formatContentLog = async (data: any) => {
        const contentArr = [];
        let messageLog = '';
        let userFirst = '';
        let userLast = '';
        let currentUserId = 'a-1';
        if (currentUser.value) currentUserId = currentUser.value._id;

        // chen danh xung va user name
        if (data.type == CONSTANTS.LOG.ASSIGNED) messageLog = t('inbox.assigned_to');
        else if (data.type == CONSTANTS.LOG.UNASSIGNED) messageLog = t('inbox.unassigned_from');
        else if (data.type == CONSTANTS.LOG.REOPENED) messageLog = t('inbox.inbox_log_reopen');
        else if (data.type == CONSTANTS.LOG.RESOLVED) messageLog = t('inbox.inbox_log_resolved');
        if (data.type !== CONSTANTS.LOG.RESOLVED && data.type !== CONSTANTS.LOG.REOPENED) {
            if (data.content == currentUserId) userLast = t('inbox.yourself');
            else userLast = await findUserNameById(data.content);
        }
        if (data.sender_id == currentUserId) userFirst = t('inbox.you');
        else userFirst = await findUserNameById(data.sender_id);
        if (userFirst != t('inbox.you') && data.content == data.sender_id) userLast = t('inbox.themself');
        if (userFirst != t('inbox.you') && data.content == currentUserId) userLast = t('inbox.inbox_relationship_you');

        contentArr.push({
            text: userFirst,
            bold: true,
        });
        contentArr.push({
            text: messageLog,
            bold: false,
        });
        contentArr.push({
            text: userLast,
            bold: true,
        });
        const timeFormat = {
            text: filters.formatTime(data.created_at, false, true, false, false),
            bold: true,
        };
        const textBeforeTime = {
            text: filters.textBeforeTime(data.created_at),
            bold: false,
        };

        if (textBeforeTime.text == 'just now') {
            textBeforeTime.bold = true;
            textBeforeTime.text = t('inbox.inbox_log_just_now');
        }

        contentArr.push(textBeforeTime);

        if (timeFormat.text != 'Now') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (timeFormat.text.includes('Yesterday')) {
                contentArr.push({ text: 'yesterday', bold: true });
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                if (timeFormat.text.split('Yesterday')[1] != undefined) {
                    contentArr.push({ text: 'at', bold: false });
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    contentArr.push({ text: timeFormat.text.split('Yesterday')[1], bold: true });
                }
            } else contentArr.push(timeFormat);
        }
        data.contentArr = contentArr;
        return data;
    };

    const formatMessageDeletedContent = async (data: any) => {
        let logDeleted = '';
        let userActionDelete = '';
        let currentUserId = 'a-1';
        if (currentUser.value) currentUserId = currentUser.value._id;

        if (data._auid === currentUserId || data._auid === null) userActionDelete = t('inbox.you');
        else userActionDelete = await findUserNameById(data._auid);

        const timeFormat = {
            text: filters.formatTime(data.updated_at, false, true, false, false),
            bold: true,
        };
        const textBeforeTime = {
            text: filters.textBeforeTime(data.updated_at),
            bold: false,
        };

        if (textBeforeTime.text == 'just now') {
            textBeforeTime.bold = true;
            textBeforeTime.text = t('inbox.inbox_log_just_now');
        }

        let text = ' removed a message ';
        if (data.is_whisper) text = ' removed a private note ';

        logDeleted = userActionDelete + text + textBeforeTime.text;

        if (timeFormat.text !== 'Now') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (timeFormat.text.includes('Yesterday')) {
                logDeleted = logDeleted + ' yesterday';
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                if (timeFormat.text.split('Yesterday')[1] != undefined) {
                    logDeleted = logDeleted + ' at';
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    logDeleted = logDeleted + ' ' + timeFormat.text.split('Yesterday')[1];
                }
            } else logDeleted = logDeleted + ' ' + timeFormat.text;
        }
        data.logDeleted = logDeleted;
        return data;
    };

    const contentMessageDeletedInConvoList = (data: any) => {
        let logDeleted = '';

        const timeFormat = {
            text: filters.formatTime(data.updated_at, false, true, false, false),
            bold: true,
        };
        const textBeforeTime = {
            text: filters.textBeforeTime(data.updated_at),
            bold: false,
        };

        if (textBeforeTime.text == 'just now') {
            textBeforeTime.bold = true;
            textBeforeTime.text = t('inbox.inbox_log_just_now');
        }

        let text = 'removed a message ';
        if (data.is_whisper) text = 'removed a private note ';

        logDeleted = text + textBeforeTime.text;

        if (timeFormat.text != 'Now') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (timeFormat.text.includes('Yesterday')) {
                logDeleted = logDeleted + ' yesterday';
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                if (timeFormat.text.split('Yesterday')[1] != undefined) {
                    logDeleted = logDeleted + ' at';
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    logDeleted = logDeleted + ' ' + timeFormat.text.split('Yesterday')[1];
                }
            } else logDeleted = logDeleted + ' ' + timeFormat.text;
        }
        return logDeleted;
    };

    const subtractTime = (timeOld: any, timeNew: any) => {
        if (timeOld && timeNew) {
            switch (typeof timeOld) {
                case 'number':
                    break;
                case 'string':
                    timeOld = +new Date(timeOld);
                    break;
                case 'object':
                    if (timeOld.constructor === Date) timeOld = timeOld.getTime();
                    break;
                default:
                    timeOld = +new Date();
            }

            switch (typeof timeNew) {
                case 'number':
                    break;
                case 'string':
                    timeNew = +new Date(timeNew);
                    break;
                case 'object':
                    if (timeNew.constructor === Date) timeNew = timeNew.getTime();
                    break;
                default:
                    timeNew = +new Date();
            }

            const secondsOld = (+new Date() - timeOld) / 1000;
            const secondsNew = (+new Date() - timeNew) / 1000;
            // 5p
            if (secondsOld - secondsNew < 300) return true;
            return false;
        }
    };

    const conversationDetailGroupTime = async (data: Array<any>) => {
        // nhóm thời gian theo ngày và phút
        return data.reduce((groups, message) => {
            const date = message.time_group;
            if (!groups[date]) {
                groups[date] = [];
            }
            if (groups[date].length < 1) groups[date].push([message]);
            else {
                if (
                    message.sender_type != groups[date][groups[date].length - 1][0].sender_type ||
                    message.group != groups[date][groups[date].length - 1][0].group ||
                    message.group == CONSTANTS.GROUP.LOG
                )
                    groups[date].push([message]);
                else {
                    const checkInTime = subtractTime(
                        groups[date][groups[date].length - 1][groups[date][groups[date].length - 1].length - 1]
                            .created_at,
                        message.created_at,
                    );
                    // check xem có cùng 1 ng gửi không
                    if (
                        message.sender_id !=
                        groups[date][groups[date].length - 1][groups[date][groups[date].length - 1].length - 1]
                            .sender_id
                    ) {
                        groups[date].push([message]);
                    }
                    // check message note
                    else if (
                        message.is_whisper !=
                        groups[date][groups[date].length - 1][groups[date][groups[date].length - 1].length - 1]
                            .is_whisper
                    ) {
                        groups[date].push([message]);
                    } else {
                        if (checkInTime) groups[date][groups[date].length - 1].push(message);
                        else groups[date].push([message]);
                    }
                }
            }
            return groups;
        }, {});
    };

    const formatDataConversationDetail = async (data: Array<any>) => {
        for (let m of data) {
            // m.email_error = Math.random() < 0.3;
            m.email_error = false;
            if (typeof m.attachments === 'undefined' || m.attachments == null || m.attachments == 'null')
                m.attachments = [];
            if (m.status === CONSTANTS.STATUS.DELETED) {
                m = await formatMessageDeletedContent(m);
            }
            if (m.group == CONSTANTS.GROUP.MESSAGE) {
                m.format = 'message';
                if (m.username == undefined) m.username = '';
                if (m.avatar_src == undefined) m.avatar_src = '';
                if (m.avatar_bg == undefined) m.avatar_bg = '';
                // if (m.sender_type == undefined) {
                // if (m.sender == null) {
                if (m.sender_type == CONSTANTS.SENT_BY.USER) {
                    // m.sender_type = CONSTANTS.SENT_BY.USER;
                    let user;
                    if (m.sender_id == currentUser.value._id) user = currentUser.value;
                    else user = await findUserById(m.sender_id);
                    m.username = user.username;
                    if (user.avatar_src !== '' && user.avatar_src !== null)
                        m.avatar_src = `${process.env.VUE_APP_FILE_URL}/${user.avatar_src}`;
                    if (typeof user.user_removed != undefined && user.user_removed) m.user_removed = true;
                    if (user.avatar_bg != undefined) m.avatar_bg = user.avatar_bg;
                }
                // else m.sender_type = CONSTANTS.SENT_BY.CUSTOMER;
                // }
                m.time_group = filters.formatTime(m.created_at, true, false, true);
            } else if (m.group == CONSTANTS.GROUP.LOG) {
                m.format = 'log';
                if (m.content == undefined) {
                    m.format = 'none';
                }
                m.time_group = filters.formatTime(m.created_at, true, false, true);
                m = await formatContentLog(m);
            } else {
                m.format = 'none';
            }
            if (m.type == CONSTANTS.MESSAGE_TYPE.IMAGE || m.type == CONSTANTS.MESSAGE_TYPE.FILE) {
                if (m.attachments == null || m.attachments == 'null') {
                    m.images = [];
                    m.files = [];
                } else {
                    m.images = m.attachments.filter((att: any) => att.type === CONSTANTS.MESSAGE_ATTACHMENT_TYPE.IMAGE);
                    m.files = m.attachments.filter((att: any) => att.type === CONSTANTS.MESSAGE_ATTACHMENT_TYPE.FILE);
                }
            } else if (m.type == CONSTANTS.MESSAGE_TYPE.EMAIL) {
                m.files = m.attachments.filter((att: any) => att.type === CONSTANTS.MESSAGE_ATTACHMENT_TYPE.FILE);
                m.images = m.attachments.filter((att: any) => att.type === CONSTANTS.MESSAGE_ATTACHMENT_TYPE.IMAGE);
                if (m.attachment_errors && m.attachment_errors.length > 0) {
                    for (let i = 0; i < m.attachment_errors.length; i++) {
                        m.files.push({ name: 'error', error: true });
                    }
                }
                const contentArr = m.content.split('<div class="gmail_quote"');
                if (contentArr.length > 0) m.content = contentArr[0];
                if (
                    typeof m.attachment_cids !== 'undefined' &&
                    m.attachment_cids !== null &&
                    Object.keys(m.attachment_cids).length > 0
                ) {
                    for (const keyId in m.attachment_cids) {
                        m.content = m.content.replace(keyId, m.attachment_cids[keyId]);
                    }
                }
                if (typeof m.attachments !== 'undefined' && m.attachments !== null) {
                    for (const attachment in m.attachments) {
                        m.attachments[attachment].includeContent = m.content.includes(m.attachments[attachment]._id);
                        m.content = m.content.replace(m.attachments[attachment]._id, `${process.env.VUE_APP_FILE_URL}/${m.attachments[attachment].src}`);
                    }
                }
            } else {
                if (typeof m.attachments !== 'undefined') {
                    m.files = m.attachments.filter((att: any) => att.type === CONSTANTS.MESSAGE_ATTACHMENT_TYPE.FILE);
                }
            }
        }
        const messageGroup = await conversationDetailGroupTime(data.reverse());
        return messageGroup;
    };

    const getConversationDetail = async (conversationId: any, nextPage: any) => {
        const response = {
            error: false,
            next_page: '',
            data: [],
        };
        try {
            await services.getConversationDetail(conversationId, nextPage).then((res: any) => {
                const { data } = res;
                const { error } = data;
                response.error = error;
                response.data = data.data;
                response.next_page = data.next_page;
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (response.data.length < 1) {
                response.data = messageConversationCache.value;
                messageConversationCache.value = [];
            }
            if (response.data.length === 1) {
                if (response.data[0]['group'] === CONSTANTS.GROUP.LOG && messageConversationCache.value.length > 0) {
                    response.data = messageConversationCache.value;
                    messageConversationCache.value = [];
                }
            }
            response.data = await formatDataConversationDetail(response.data);
            if (response.data.length > 0) response.data = response.data.reverse();
            return response;
        } catch (e) {
            return response;
        }
    };

    // B1: kiểm tra xem đã có group day chưa. chưa thì tạo mới rồi push
    // B2: đã có group day thì check xem có cùng người gửi và kiểu tin nhắn là log hay message
    // B3: kiểm tra time trong vòng 5p thì merger còn quá thì push cái mới
    const mergeMessageNew = async (newMessage: any) => {
        const index = Object.keys(newMessage)[0];
        let oldMessage: any;
        // eslint-disable-next-line prefer-const
        oldMessage = messages.value;
        if (oldMessage[index]) {
            if (
                newMessage[index][0][0].sender_type != oldMessage[index][oldMessage[index].length - 1][0].sender_type ||
                newMessage[index][0][0].group != oldMessage[index][oldMessage[index].length - 1][0].group ||
                newMessage[index][0][0].group == CONSTANTS.GROUP.LOG
            ) {
                oldMessage[index].push([newMessage[index][0][0]]);
            } else {
                const checkInTime = subtractTime(
                    oldMessage[index][oldMessage[index].length - 1][
                        oldMessage[index][oldMessage[index].length - 1].length - 1
                    ].created_at,
                    newMessage[index][0][0].created_at,
                );
                // check xem có cùng ng gửi không
                if (
                    newMessage[index][0][0].sender_id !=
                    oldMessage[index][oldMessage[index].length - 1][
                        oldMessage[index][oldMessage[index].length - 1].length - 1
                    ].sender_id
                ) {
                    oldMessage[index].push([newMessage[index][0][0]]);
                }
                // check message note
                else if (
                    newMessage[index][0][0].is_whisper !=
                    oldMessage[index][oldMessage[index].length - 1][
                        oldMessage[index][oldMessage[index].length - 1].length - 1
                    ].is_whisper
                ) {
                    oldMessage[index].push([newMessage[index][0][0]]);
                } else {
                    if (checkInTime) oldMessage[index][oldMessage[index].length - 1].push(newMessage[index][0][0]);
                    else oldMessage[index].push([newMessage[index][0][0]]);
                }
            }
        } else {
            oldMessage[index] = [];
            oldMessage[index].push(newMessage[index][0]);
            messages.value = oldMessage;
        }
    };

    // B1: kiểm tra xem đã có group day cuối của cũ có trùng với đầu của hiện tại.
    // B2: khác nhau thì merge message cũ vào message hiện tại
    // B3: Nếu trùng thì check time và người gửi để merge
    const mergeMessageOld = async (oldMessage: any) => {
        const index = Object.keys(oldMessage)[Object.keys(oldMessage).length - 1];
        let messageUpdate: any;
        // eslint-disable-next-line prefer-const
        messageUpdate = messages.value;

        if (messageUpdate[index]) {
            if (
                oldMessage[index][oldMessage[index].length - 1][
                    oldMessage[index][oldMessage[index].length - 1].length - 1
                ].sender_type != messageUpdate[index][0][0].sender_type ||
                oldMessage[index][oldMessage[index].length - 1][
                    oldMessage[index][oldMessage[index].length - 1].length - 1
                ].group != messageUpdate[index][0][0].group ||
                oldMessage[index][oldMessage[index].length - 1][
                    oldMessage[index][oldMessage[index].length - 1].length - 1
                ].group == CONSTANTS.GROUP.LOG
            ) {
                messageUpdate[index] = [...oldMessage[index], ...messageUpdate[index]];
            } else {
                const checkInTime = subtractTime(
                    oldMessage[index][oldMessage[index].length - 1][
                        oldMessage[index][oldMessage[index].length - 1].length - 1
                    ].created_at,
                    messageUpdate[index][0][0].created_at,
                );
                if (
                    messageUpdate[index][0][0].sender_id !=
                    oldMessage[index][oldMessage[index].length - 1][
                        oldMessage[index][oldMessage[index].length - 1].length - 1
                    ].sender_id
                ) {
                    messageUpdate[index] = [...oldMessage[index], ...messageUpdate[index]];
                } else {
                    if (checkInTime) {
                        // merge message, remove, xong lại merge lần nữa
                        messageUpdate[index][0] = [
                            ...oldMessage[index][oldMessage[index].length - 1],
                            ...messageUpdate[index][0],
                        ];
                        oldMessage[index].pop();
                        messageUpdate[index] = [...oldMessage[index], ...messageUpdate[index]];
                    } else messageUpdate[index] = [...oldMessage[index], ...messageUpdate[index]];
                }
            }
        }
        messageUpdate = { ...oldMessage, ...messageUpdate };
        return messageUpdate;
    };

    const callData = async (isPush: any, isSetTimeout: any) => {
        if (conversationId.value != '') {
            if (nextPage.value == null || nextPage.value == 'null') nextPage.value = '';
            const response = await getConversationDetail(conversationId.value, nextPage.value);
            if (!response.error) {
                if (isPush) messages.value = await mergeMessageOld(response.data);
                else messages.value = response.data;
                nextPage.value = response.next_page;
                if (isSetTimeout) await new Promise(resolve => setTimeout(resolve, 300));
                noMessage.value = false;
            }
        }
    };

    const updateSeenMessage = () => {
        if (idFakeNewMessage.value != '' && lastMessageSeenByCustomer.value != idFakeNewMessage.value) {
            lastMessageSeenByCustomer.value = idFakeNewMessage.value;
            timeSeenLastMessage.value = new Date();
        }
    };

    const deleteMessage = async (id: any): Promise<any> => {
        const res: AxiosResponse = await services.deleteMessage(id);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const handleMessageDeleted = async (message: any): Promise<any> => {
        // update message list
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore

        Object.keys(messages.value).forEach(function(key) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            messages.value[key].forEach((messageGroup: any) => {
                messageGroup.forEach((messageDetail: any) => {
                    if (messageDetail._id === message._id) {
                        messageDetail.status = CONSTANTS.STATUS.DELETED;
                        // messageDetail.updated_at = new Date().toISOString();
                        messageDetail.updated_at = message.updated_at;
                        if (typeof message._auid !== 'undefined') messageDetail._auid = message._auid;
                        else messageDetail._auid = currentUser.value._id;
                        messageDetail = formatMessageDeletedContent(messageDetail);
                    }
                });
            });
        });

        // update convo list

        conversations.value.forEach((convo: any) => {
            if (
                convo.last_message &&
                (convo.last_message.id === message._id || convo.last_message._id === message._id)
            ) {
                convo.last_message.status = CONSTANTS.STATUS.DELETED;
                // convo.last_message.updated_at = new Date().toISOString();
                convo.last_message.updated_at = message.updated_at;
                if (typeof message._auid !== 'undefined') convo.last_message._auid = message._auid;
                else convo.last_message._auid = currentUser.value._id;
            }
        });
    };

    const handleMessageFakeId = async (message: any): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 100));
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        Object.keys(messages.value).forEach(function(key) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            messages.value[key].forEach((messageGroup: any) => {
                messageGroup.forEach((messageDetail: any) => {
                    if (messageDetail.fake_id === message.fake_id) {
                        messageDetail.id = message._id;
                        messageDetail._id = message._id;
                        idFakeNewMessage.value = message._id;
                    }
                });
            });
        });
    };

    const updateTagOfMessage = async (tags: any, messageId: any): Promise<any> => {
        Object.keys(messages.value).forEach(function(key) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            messages.value[key].forEach((messageGroup: any) => {
                messageGroup.forEach((messageDetail: any) => {
                    if (messageDetail._id === messageId) {
                        messageDetail.tags = tags;
                    }
                });
            });
        });
    };

    const downloadFile = async (url: any): Promise<any> => {
        const res: AxiosResponse = await services.downloadFile(url);
        if (res) {
            return Promise.resolve(res);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const getMessageDetail = async (id: any): Promise<any> => {
        const res: AxiosResponse = await services.getMessageDetail(id);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        messages,
        callData,
        nextPage,
        conversationId,
        conversationSelected,
        getConversationDetail,
        formatDataConversationDetail,
        mergeMessageNew,
        mergeMessageOld,
        showIndicatorNewMessage,
        countNewMessage,
        lastMessageSeenByCustomer,
        updateSeenMessage,
        idFakeNewMessage,
        timeSeenLastMessage,
        conversationDetail,
        userTyping,
        deleteMessage,
        handleMessageDeleted,
        contentMessageDeletedInConvoList,
        handleMessageFakeId,
        downloadFile,
        updateTagOfMessage,
        getMessageDetail,
    };
};
