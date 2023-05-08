declare const __process: NodeJS.Process; // set in rollup.config
// import { services } from '@/modules/inbox/services';
import { inject, ref } from 'vue';
import constants from '../constants/constants';
import filters from '../utils/filters';

const listUser = ref([]);
const messages = ref<Array<any>>([]);
const showIndicatorNewMessage = ref(false);
const countNewMessage = ref(0);

export const useInbox = (emit: any = null) => {
    const nextPage = ref<string>('');
    const loading = ref<boolean>(false);
    const { workspace_id, conversation_id }: any = inject('contact');

    const findUserById = async (userId: string) => {
        if (userId == null) return '';
        return await listUser.value.find((u: any) => u._id == userId);
    };

    const updateInfoUserInMessage = (message: any) => {
        if (message.sender_type == constants.SENT_BY.USER) {
            const user: any = listUser.value.find((u: any) => u._id == message.sender_id);
            if (user == undefined) return message;
            if (message.avatar_src == '' && user.avatar_src != '' && user.avatar_src !== null) {
                message.avatar_src = `${__process.env.VUE_APP_FILE_URL}/${user.avatar_src}`;
            }
            if (message.username == '') message.username = user.username;
            if (message.avatar_bg == '') message.avatar_bg = user.avatar_bg;
        }
        return message;
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

    const conversationDetailGroupTime = async (data: any) => {
        // nhóm thời gian theo ngày và phút
        return data.reduce((groups: any, message: any) => {
            const date = message.time_group;
            if (!groups[date]) {
                groups[date] = [];
            }
            if (groups[date].length < 1) groups[date].push([message]);
            else {
                if (
                    message.sender_type != groups[date][groups[date].length - 1][0].sender_type ||
                    message.group != groups[date][groups[date].length - 1][0].group ||
                    message.group == constants.GROUP.LOG
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
                    } else {
                        if (checkInTime) groups[date][groups[date].length - 1].push(message);
                        else groups[date].push([message]);
                    }
                }
            }
            return groups;
        }, {});
    };

    // if (
    //     m._id === '615410d763d11620316d5cbd' ||
    //     m._id == '611f64987aa32c79429493af' ||
    //     m._id == '61518314e4e0ece63e0d4cd4' ||
    //     m._id == '614812f17de16f6d8db51b78' ||
    //     m._id == '61541f1a63d116ad596d64ab' ||
    //     m._id == '61541f9e63d1166ab46d66ba' ||
    //     m._id == '61482bbbfde84f0212a93a2a'
    // ) {
    //     m.content = '';
    //     m.onlyImage = true;
    //     m.images = [
    //         {
    //             _id: 'abc1',
    //             src: 'https://picsum.photos/300/400/?blur',
    //         },
    //         {
    //             _id: 'abc2',
    //             src: 'https://picsum.photos/300/400?grayscale',
    //         },
    //         {
    //             _id: 'abc3',
    //             src: 'https://picsum.photos/300/400/?blur',
    //         },
    //         {
    //             _id: 'abc4',
    //             src:
    //                 'https://s3-ap-southeast-1.amazonaws.com/static-dev.fireapps.tech/e6782d2714d7e189b8c6-1629700177724.jpg',
    //         },
    //     ];
    // }
    //
    // if (
    //     m._id === '61540cb563d116cd946d5c21' ||
    //     m._id == '614da0949c81a904dbf4d334' ||
    //     m._id == '615182d2e4e0ecc67c0d4cc8' ||
    //     m._id == '61482c54fde84f29dfa93a67' ||
    //     m._id == '61541eec63d1166ede6d6478' ||
    //     m._id == '61482c65fde84feab2a93a75'
    // ) {
    //     m.onlyImage = true;
    //     m.images = [
    //         {
    //             _id: 'abc1',
    //             src: 'https://picsum.photos/300/400?grayscale',
    //         },
    //     ];
    // }
    // if (
    //     m._id === '615182d5e4e0ecb0b80d4ccc' ||
    //     m._id === '61540cc163d116814e6d5c26' ||
    //     m._id === '61541f6f63d11601236d668a' ||
    //     m._id === '61541f9663d1166e2c6d66b6' ||
    //     m._id === '61541f1463d1167bb96d6499'
    // ) {
    //     m.onlyImage = true;
    //     m.images = [
    //         {
    //             _id: 'abc1',
    //             src: 'https://picsum.photos/200/300?grayscale',
    //         },
    //         {
    //             _id: 'abc2',
    //             src: 'https://picsum.photos/300/400/?blur',
    //         },
    //     ];
    // }
    // if (m._id === '615186d4e4e0ec5b570d4de4' || m._id === '61541fa363d116cd6b6d66c2') {
    //     m.content =
    //         "11111212 <img src='https://www.nippon.com/en/ncommon/contents/japan-glances/158513/158513.jpg' alt='' data-img-id='11' /> fwefwefw wefwef ưerfwf <img src='https://www.nippon.com/en/ncommon/contents/japan-glances/158513/158513.jpg' alt='' data-img-id='2' />";
    // }

    const formatMessageDeletedContent = async (data: any) => {
        let logDeleted = '';
        let usernameActionDelete = '';

        if (!data._auid) usernameActionDelete = '';
        else {
            const userAction: any = await findUserById(data._auid);
            if (!userAction) usernameActionDelete = '';
            else usernameActionDelete = userAction.username;
        }

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
            textBeforeTime.text = 'just now';
        }

        let text = ' removed a message ';
        if (data.is_whisper) text = ' removed a private note ';

        logDeleted = usernameActionDelete + text + textBeforeTime.text;

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
        return logDeleted;
    };

    const formatDataConversationDetail = async (data: any) => {
        let m: any = null;
        for (m of data) {
            // m.email_error = Math.random() < 0.3;
            m.email_error = false;
            if (typeof m.status === 'undefined') m.status = constants.STATUS.ACTIVATED;
            if (m.status === constants.STATUS.DELETED) {
                m.logDeleted = await formatMessageDeletedContent(m);
            }
            if (m.group == constants.GROUP.MESSAGE) {
                m.format = 'message';
                if (m.avatar_src == undefined) m.avatar_src = '';
                if (m.avatar_bg == undefined) m.avatar_bg = '';
                if (m.username == undefined) m.username = '';
                if (m.sender_type == constants.SENT_BY.USER) {
                    const user: any = await findUserById(m.sender_id);
                    if (user != undefined) {
                        m.username = user.username;
                        if (user.avatar_src != '' && user.avatar_src !== null) {
                            m.avatar_src = `${__process.env.VUE_APP_FILE_URL}/${user.avatar_src}`;
                        }
                        if (user.avatar_bg != undefined) m.avatar_bg = user.avatar_bg;
                    } else {
                        m.user_removed = true;
                        m.avatar_src = 'no-user.svg';
                    }
                }
                m.time_group = filters.formatTime(m.created_at, true, false, true);
            } else {
                m.format = 'none';
            }
            if (m.type == constants.MESSAGE_TYPE.IMAGE || m.type == constants.MESSAGE_TYPE.FILE) {
                if (m.attachments == null || m.attachments == 'null') {
                    m.images = [];
                    m.files = [];
                } else {
                    m.images = m.attachments.filter((att: any) => att.type === constants.MESSAGE_ATTACHMENT_TYPE.IMAGE);
                    m.files = m.attachments.filter((att: any) => att.type === constants.MESSAGE_ATTACHMENT_TYPE.FILE);
                }
            } else if (m.type == constants.MESSAGE_TYPE.EMAIL) {
                m.files = m.attachments.filter((att: any) => att.type === constants.MESSAGE_ATTACHMENT_TYPE.FILE);
                m.images = m.attachments.filter((att: any) => att.type === constants.MESSAGE_ATTACHMENT_TYPE.IMAGE);
                if (m.attachment_errors && m.attachment_errors.length > 0) {
                    for (let i = 0; i < m.attachment_errors.length; i++) {
                        m.files.push({ name: 'error', error: true })
                    }
                }
                const contentArr = m.content.split('<div class=\"gmail_quote\"')
                if (contentArr.length > 0) m.content = contentArr[0]
                if (typeof m.attachment_cids !== 'undefined' && m.attachment_cids !== null && Object.keys(m.attachment_cids).length > 0) {
                    for (const keyId in m.attachment_cids) {
                        m.content = m.content.replace(keyId, m.attachment_cids[keyId])
                    }
                }
                if (typeof m.attachments !== 'undefined' && m.attachments !== null) {
                    for (const attachment in m.attachments) {
                        m.attachments[attachment].includeContent = m.content.includes(m.attachments[attachment]._id);
                        m.content = m.content.replace(m.attachments[attachment]._id, `${__process.env.VUE_APP_FILE_URL}/${m.attachments[attachment].src}`)
                    }
                }
            } else {
                if (typeof m.attachments !== 'undefined') {
                    m.files = m.attachments.filter((att: any) => att.type === constants.MESSAGE_ATTACHMENT_TYPE.FILE);
                }
            }
        }
        return await conversationDetailGroupTime(data.reverse());
    };

    // B1: kiểm tra xem đã có group day chưa. chưa thì tạo mới rồi push
    // B2: đã có group day thì check xem có cùng người gửi và kiểu tin nhắn là log hay message
    // B3: kiểm tra time trong vòng 5p thì merger còn quá thì push cái mới
    const mergeMessageNew = async (newMessage: any, demoMode = false) => {
        const index = Object.keys(newMessage)[0];
        let oldMessage: any;
        // eslint-disable-next-line prefer-const
        oldMessage = messages.value;
        if (oldMessage[index]) {
            if (
                newMessage[index][0][0].sender_type != oldMessage[index][oldMessage[index].length - 1][0].sender_type ||
                newMessage[index][0][0].group != oldMessage[index][oldMessage[index].length - 1][0].group ||
                newMessage[index][0][0].group == constants.GROUP.LOG
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
                } else {
                    if (checkInTime) oldMessage[index][oldMessage[index].length - 1].push(newMessage[index][0][0]);
                    else oldMessage[index].push([newMessage[index][0][0]]);
                }
            }
        } else {
            oldMessage[index] = [];
            if(demoMode && JSON.stringify(oldMessage) === '[]') {
                const dateSting = `{ "${index}": [] }`
                oldMessage = JSON.parse(dateSting);
            }
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
                ].group == constants.GROUP.LOG
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

    const getConversationDetail = async (conversationId: string, nextPage: string, workspace_id: string) => {
        const response = {
            error: false,
            next_page: '',
            data: [],
        };
        try {
            const fetchUrl = `${__process.env.VUE_APP_ROOT_API}/chat/api/v1/conversations/no-auth/${conversationId}/messages?workspace_id=${workspace_id}&next_page=${nextPage}`;
            const res = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const dataFromAPI = await res.json();
            if (!dataFromAPI.error) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                response.error = dataFromAPI.error;
                response.data = dataFromAPI.data;
                response.next_page = dataFromAPI.next_page;
            }

            response.data = await formatDataConversationDetail(response.data);
            if (response.data.length > 0) response.data = response.data.reverse();
            return response;
        } catch (e) {
            return response;
        }
    };

    const uploadImage = async (formData: any, headers: any) => {
        const response = {
            error: false,
            data: [],
        };
        loading.value = true;
        try {
            const fetchUrl = `${__process.env.VUE_APP_ROOT_API}/chat/api/v1/utils/public/upload`;
            const res = await fetch(fetchUrl, {
                method: 'POST',
                // headers: {
                // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryeIYUjGtpFP3hUr5n'
                // },
                headers: headers,
                body: formData,
            });
            const dataFromAPI = await res.json();
            if (!dataFromAPI.error) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                response.error = dataFromAPI.error;
                response.data = dataFromAPI.data;
                loading.value = false;
            }
            return response;
        } catch (e) {
            loading.value = false;
            return e;
        }
    };

    const getConversationAssignee = async (org_id: string, workspace_id: string, conversation_id: string) => {
        const response = {
            error: false,
            data: [],
        };
        try {
            const fetchUrl = `${__process.env.VUE_APP_ROOT_API}/auth/api/v1/users/no-auth/list?org_id=${org_id}&workspace_id=${workspace_id}&convo_id=${conversation_id}`;
            const res = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const dataFromAPI = await res.json();
            if (!dataFromAPI.error) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                response.error = dataFromAPI.error;
                response.data = dataFromAPI.data;
            }
            console.log('response assignee from API', response);
            return response;
        } catch (e) {
            return response;
        }
    };

    const callData = async (isPush: boolean) => {
        if (!isPush) await new Promise(resolve => setTimeout(resolve, 100));
        if (nextPage.value == null || nextPage.value == 'null') nextPage.value = '';
        const response = await getConversationDetail(conversation_id, nextPage.value, workspace_id);
        if (!response.error) {
            if (isPush) messages.value = await mergeMessageOld(response.data);
            else messages.value = response.data;
            nextPage.value = response.next_page;
            if (Object.keys(messages.value).length === 0) emit('handleNewConvo');
        }
    };

    const handleMessageDeleted = async (message: any) => {
        let key: any;
        for (key of Object.keys(messages.value)) {
            for (const messageGroup of messages.value[key]) {
                for (const messageDetail of messageGroup) {
                    if (messageDetail._id === message._id) {
                        messageDetail.status = constants.STATUS.DELETED;
                        messageDetail.updated_at = message.updated_at;
                        if (typeof message._auid !== 'undefined') messageDetail._auid = message._auid;
                        else messageDetail._auid = '';
                        messageDetail.logDeleted = await formatMessageDeletedContent(messageDetail);
                    }
                }
            }
        }
    };

    const handleMessageFakeId = async (message: any) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        let key: any
        for (key of Object.keys(messages.value)) {
            for (const messageGroup of messages.value[key]) {
                for (const messageDetail of messageGroup) {
                    if (messageDetail.fake_id === message.fake_id) {
                        messageDetail.id = message._id;
                        messageDetail._id = message._id;
                    }
                }
            }
        }
    };

    const downloadFile = async (url: any, fileName: any) => {
        fetch(url)
            .then((res) => {
                return res.blob();
            })
            .then((data) => {
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL(data);
                const tag = document.createElement('a');
                tag.href = imageUrl;
                tag.download = fileName;
                document.body.appendChild(tag);
                tag.click();
                document.body.removeChild(tag);
            });
    };

    return {
        getConversationDetail,
        getConversationAssignee,
        formatDataConversationDetail,
        updateInfoUserInMessage,
        listUser,
        callData,
        nextPage,
        messages,
        mergeMessageNew,
        showIndicatorNewMessage,
        countNewMessage,
        uploadImage,
        loading,
        handleMessageDeleted,
        handleMessageFakeId,
        downloadFile,
    };
};
