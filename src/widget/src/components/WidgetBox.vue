<template>
    <div
        class="wb"
        :class="{ 'wb--demo': isDemoMode }"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
        @dragenter="dragenter"
    >
        <div v-if="widgetStatus <= 2" class="wb-box-content">
            <div
                class="wb-home"
                :class="{ 'wb-home--collapse': isCollapseTime, 'wb-home--ip-email': widgetStatus == 2 }"
            >
                <img class="wb-home__logo" src="../assets/images/logo-white.svg" />
                <tooltip-component
                    type="light"
                    position="top"
                    :content="formatGreetingIntro(greetingTextDisplay)"
                    showByTruncate
                    :truncateLineClamp="3"
                >
                    <span class="wb-home__greeting truncate" v-if="isDemoMode" v-html="greetingTextDisplay"></span>
                </tooltip-component>
                <tooltip-component
                    type="light"
                    position="top"
                    :content="formatGreetingIntro(introTextDisplay)"
                    showByTruncate
                    :truncateLineClamp="4"
                >
                    <span class="wb-home__intro truncate" v-if="isDemoMode" v-html="introTextDisplay"></span>
                </tooltip-component>
                <div v-if="widgetStatus == 1" class="wb-home__avatars">
                    <div class="wb-home__avatars-blur"></div>
                    <img v-if="isDemoMode" class="wb-home__avatars-img" src="../assets/images/avatars-sample.png" />
                </div>
            </div>
            <div
                v-if="widgetStatus == 1"
                class="wb-home-content"
                :class="{ 'wb-home-content--collapse': isCollapseTime }"
            >
                <div class="wb-home-content__wrapper">
                    <span class="wb-home-content__title">{{ formatReplyTime(settings && settings.reply_time) }}</span>
                    <span class="wb-home-content__times">
                        <div v-if="settings && settings.office_hour && settings.office_hour.length == 0">
                            We’re available 24/7
                        </div>
                        <template v-if="settings && settings.office_hour && settings.office_hour.length > 0">
                            <template v-if="resultsTime.length <= 3">
                                <span>
                                    We’re available {{ resultsTime[0] && resultsTime[0].length === 7 ? '' : 'on' }}
                                </span>
                                <template
                                    v-if="
                                        resultsTime.length == 2 &&
                                        labelTime(resultsTime[0]) === 'Weekdays' &&
                                        labelTime(resultsTime[1]) === 'Weekends'
                                    "
                                >
                                    <span v-for="(item, index) in resultsTime" :key="index">
                                        {{
                                            `${labelTime(item) === 'Weekends' ? 'and' : ''} ${labelTime(
                                                item,
                                            )} ${filters.hoursToAMPM(item[0].range[0])} - ${filters.hoursToAMPM(
                                                item[0].range[1],
                                            )}`
                                        }}
                                    </span>
                                </template>
                                <span v-else v-for="(item, index) in resultsTime" :key="index">
                                    {{
                                        `${labelTime(item)} ${filters.hoursToAMPM(
                                            item[0].range[0],
                                        )} - ${filters.hoursToAMPM(item[0].range[1])}`
                                    }}
                                </span>
                            </template>
                            <template v-else>
                                <span class="wb-home-content__times-collapse" @click="onClickCollapse">
                                    Our office hours
                                    <CaretRight v-if="!isCollapseTime" />
                                    <CaretDown v-else />
                                </span>
                                <template v-if="isCollapseTime">
                                    <span>
                                        We’re available {{ resultsTime[0] && resultsTime[0].length === 7 ? '' : 'on' }}
                                    </span>
                                    <span v-for="(item, index) in resultsTime" :key="index">
                                        {{
                                            `${labelTime(item)} ${filters.hoursToAMPM(
                                                item[0].range[0],
                                            )} - ${filters.hoursToAMPM(item[0].range[1])}`
                                        }}
                                    </span>
                                </template>
                            </template>
                        </template>
                        <span class="wb-home-content__timezone">
                            {{ formatTimezone(settings.timezone_label) }}
                        </span>
                    </span>
                </div>
            </div>
            <div class="wb-input-email" v-else-if="widgetStatus == 2">
                <div>
                    <InputComponent :placeholder="settings.email_placeholder" :error="isErrorEmail" v-model="email"
                        ><envelope
                    /></InputComponent>
                    <span v-if="isErrorEmail">Invalid email format, please try again.</span>
                </div>
                <div>
                    <InputComponent textArea :placeholder="settings.messsage_placeholder" v-model="firstMessage"
                        ><comment
                    /></InputComponent>
                </div>
            </div>
            <div
                :class="{
                    'wb-input-email-button--disabled':
                        widgetStatus == 2 && (isErrorEmail || !email.trim() || !firstMessage.trim()),
                    'wb-input-email-button': widgetStatus == 2,
                    'wb-home-button': widgetStatus == 1,
                }"
                @click="onClickButton"
            >
                <span
                    :style="settings && !settings.widget_behavior.show_watermark ? 'margin-bottom:20px;' : ''"
                    v-if="widgetStatus == 2"
                    ><PaperPlane />
                    <span>Send message </span>
                </span>
                <span :style="settings && !settings.widget_behavior.show_watermark ? 'margin-bottom:40px;' : ''" v-else
                    >Start conversation</span
                >
            </div>
        </div>
        <div v-else class="wb-box-content">
            <div :class="isDemoMode ? 'wb-header-demo' : 'wb-header'">
                <template v-if="!isDemoMode">
                    <template v-if="assignee">
                        <avatar-component
                            class="avatar-message"
                            :labelShow="true"
                            :label-avatar="assignee.username"
                            :bgAvatar="assignee.avatar_bg"
                            :online="dotStatus"
                            size="small"
                            :image="assignee.avatar_src ? `${envURL}${assignee.avatar_src}` : ''"
                        />
                    </template>
                    <template v-else>
                        <div class="wb-avatar wb-none-assign">
                            <avatar-component
                                class="wb-none-assign__avatar"
                                v-for="assignee in listAssigneeLimit"
                                :key="assignee._id"
                                :labelShow="false"
                                :label-avatar="assignee.username"
                                :bgAvatar="assignee.avatar_bg"
                                size="small"
                                :image="assignee.avatar_src ? `${envURL}${assignee.avatar_src}` : ''"
                            />
                            <span class="wb-none-assign__avatar more" v-if="listAssignee.length > 4">
                                <span class="count">+{{ listAssignee.length - 4 }}</span>
                            </span>
                        </div>
                        <span class="wb-none-assign__text">{{ formatReplyTime(settings && settings.reply_time) }}</span>
                    </template>
                </template>
                <template v-else>
                    <div class="wb-header-demo__header">
                        <img src="../assets/images/avatar-sample2.svg" />
                        <div>
                            <div>{{ formatReplyTime(settings && settings.reply_time) }}</div>
                            <span v-if="settings && settings.office_hour && settings.office_hour.length == 0"
                                >We’re available 24/7</span
                            >
                            <template v-if="settings && settings.office_hour && settings.office_hour.length > 0">
                                <span v-if="settings && settings.office_hour && resultsTime.length === 1">
                                    Available {{ resultsTime[0] && resultsTime[0].length === 7 ? '' : 'on' }}
                                    <span class="text" v-for="(item, index) in resultsTime" :key="index">
                                        {{
                                            `${labelTime(item)} ${filters.hoursToAMPM(
                                                item[0].range[0],
                                            )} - ${filters.hoursToAMPM(item[0].range[1])}`
                                        }}
                                    </span>
                                </span>
                                <template v-if="settings && settings.office_hour && resultsTime.length > 1">
                                    <tooltip-component :position="'left'" type="light" :timeout="400">
                                        <div>
                                            <span v-if="settings && settings.office_hour && resultsTime.length > 1"
                                                >Our office hours</span
                                            >
                                        </div>
                                        <template #content>
                                            <div class="wb-header-demo__tooltip">
                                                <div>
                                                    We’re available
                                                    {{ resultsTime[0] && resultsTime[0].length === 7 ? '' : 'on' }}
                                                </div>
                                                <div v-if="settings.office_hour.length == 0">24/7</div>
                                                <template
                                                    v-if="
                                                        resultsTime.length == 2 &&
                                                        labelTime(resultsTime[0]) === 'Weekdays' &&
                                                        labelTime(resultsTime[1]) === 'Weekends'
                                                    "
                                                >
                                                    <div v-for="(item, index) in resultsTime" :key="index">
                                                        {{
                                                            `${labelTime(item) === 'Weekends' ? 'and' : ''} ${labelTime(
                                                                item,
                                                            )} ${filters.hoursToAMPM(
                                                                item[0].range[0],
                                                            )} - ${filters.hoursToAMPM(item[0].range[1])}`
                                                        }}
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div v-for="(item, index) in resultsTime" :key="index">
                                                        {{
                                                            `${labelTime(item)} ${filters.hoursToAMPM(
                                                                item[0].range[0],
                                                            )} - ${filters.hoursToAMPM(item[0].range[1])}`
                                                        }}
                                                    </div>
                                                </template>
                                            </div>
                                        </template>
                                    </tooltip-component>
                                </template>
                            </template>
                        </div>
                    </div>
                    <div class="wb-header-demo__greeting">
                        <tooltip-component
                            type="light"
                            position="top"
                            :content="formatGreetingIntro(greetingTextDisplay)"
                            showByTruncate
                        >
                            <!-- <span v-html="greetingTextDisplay"> </span> -->
                            <span class="truncate block" v-html="greetingTextDisplay"></span>
                        </tooltip-component>
                        <tooltip-component
                            type="light"
                            position="top"
                            :content="formatGreetingIntro(introTextDisplay)"
                            showByTruncate
                            :truncateLineClamp="3"
                        >
                            <!-- <span v-html="introTextDisplay"> </span> -->
                            <span
                                class="wb-header-demo__greeting-intro truncate block"
                                v-html="introTextDisplay"
                            ></span>
                        </tooltip-component>
                    </div>
                </template>
            </div>
            <div class="wb-content wb-content-chat">
                <MessageListDemoMode v-if="isDemoMode" />
                <MessageList
                    v-else
                    :clickReadAll="clickReadAll"
                    :isShowWidgetBox="isShowWidgetBox"
                    @handle-new-convo="handleNewConvo"
                ></MessageList>
                <template v-if="!isDemoMode && showIndicatorNewMessage">
                    <div
                        class="indicator-new-message inline-block bg-neutrals-50 pt-6p pr-12p pb-6p pl-12p"
                        @click="readAllMessage"
                    >
                        <img class="logo mx-auto" src="../assets/arrow-down.svg" alt="banner" />
                        <span class="text-14 text-neutrals-900"
                            >{{ countNewMessage }} {{ countNewMessage === 1 ? 'new message' : 'new messages' }}</span
                        >
                    </div>
                </template>
            </div>
        </div>
        <template v-if="isShowBlockComposer">
            <p class="wb-block">You can’t reply to this conversation.</p>
        </template>
        <template v-else-if="widgetStatus == 3">
            <widget-composer-container
                :style="settings && !settings.widget_behavior.show_watermark ? 'margin-bottom:20px;' : ''"
                :isNewConvo="isNewConvo"
                @handle-new-convo="handleNewConvo"
            />
        </template>
        <div class="wb-trademark" v-if="!isDemoMode || (settings && settings.widget_behavior.show_watermark)">
            <img src="../assets/footer.svg" />
        </div>
    </div>
</template>

<script >
/* global __process */
import { defineComponent, computed, onMounted, ref, inject, nextTick, watch, provide } from 'vue';
import WidgetComposerContainer from './WidgetComposerContainer.vue';
import AvatarComponent from './WidgetAvatar.vue';
import MessageList from './Message/MessageList.vue';
import MessageListDemoMode from './Message/MessageListDemoMode.vue';
import { useInbox } from '../composables/useInbox';
import getContactInfo from '../contactInfo';
import database, { dbName } from '../database';
import CaretRight from '../components/icons/CaretRight.vue';
import CaretDown from '../components/icons/CaretDown.vue';
import Envelope from '../components/icons/Envelope.vue';
import PaperPlane from '../components/icons/PaperPlane14.vue';
import Comment from '../components/icons/Comment20.vue';
import InputComponent from '../components/InputComponent.vue';
import TooltipComponent from './WidgetTooltipMessage.vue';
import filters from '../utils/filters';
import constants from '../constants/constants';

export default defineComponent({
    name: 'WidgetBox',
    components: {
        WidgetComposerContainer,
        AvatarComponent,
        MessageList,
        MessageListDemoMode,
        CaretRight,
        CaretDown,
        InputComponent,
        Envelope,
        Comment,
        PaperPlane,
        TooltipComponent,
    },
    props: ['isShowWidgetBox', 'widgetStatus'],
    setup(props, { emit }) {
        const isDemoMode = inject('isDemoMode');
        const settings = inject('settingWidgetValues');
        const isCollapseTime = ref(false);
        const email = ref('');
        const isErrorEmail = ref(false);
        const firstMessage = ref('');
        const emitter = inject('emitter');
        const {
            messages,
            getConversationAssignee,
            listUser,
            countNewMessage,
            showIndicatorNewMessage,
            handleMessageFakeId,
        } = useInbox();

        const resultsTime = ref([]);

        watch(email, (value) => {
            if (value && value.trim()) {
                isErrorEmail.value = !filters.validateEmail(value);
            } else {
                isErrorEmail.value = false;
            }
        });

        watch(
            () => props.widgetStatus,
            () => {
                if (isDemoMode) {
                    messages.value = [];
                    email.value = '';
                    firstMessage.value = '';
                }
            },
        );

        const onClickButton = () => {
            emitter.emit('onChangeStatusWidget');
            if (props.widgetStatus == 2) {
                const params = {
                    org_id: '',
                    workspace_id: '',
                    convo_id: null,
                    sender_id: null,
                    content: firstMessage.value,
                    sender_type: constants.SENT_BY.CUSTOMER,
                    full_name: '',
                    avatar_src: '',
                    avatar_bg: '',
                    is_new_convo: props.isNewConvo,
                    email: email.value,
                };
                params.created_at = new Date();
                params.format = 'message';
                params.group = 1;
                console.log('send nè', { params });
                window.setTimeout(() => {
                    emitter.emit('sendMessageDemo', params);
                }, 0);
            }
        };

        const onClickCollapse = () => {
            isCollapseTime.value = !isCollapseTime.value;
            nextTick();
            const elAvatars = document.getElementsByClassName('wb-home__avatars');
            const elWbHomeWrapper = document.getElementsByClassName('wb-home-content__wrapper');
            const elWbHome = document.getElementsByClassName('wb-home-content');
            console.log(elWbHome[0].scrollHeight > elWbHome[0].clientHeight);
            window.setTimeout(() => {
                const isHasScroll = elWbHome[0].scrollHeight > elWbHome[0].clientHeight;
                if (isCollapseTime.value && isHasScroll) {
                    elAvatars[0].style.transform = 'translateY(-68px)';
                    elWbHomeWrapper[0].style.transform = 'translateY(34px)';
                    console.log({ elWbHome: elWbHome[0] });
                    elWbHome[0].style.transform = 'translateY(-68px)';
                } else if (!isCollapseTime.value && elWbHome[0].style.transform == 'translateY(-68px)') {
                    elAvatars[0].style.transform = '';
                    elWbHomeWrapper[0].style.transform = '';
                    console.log({ elWbHome: elWbHome[0] });
                    elWbHome[0].style.transform = '';
                }
            }, 0);
        };

        const listAssignee = ref([]);
        const listAssigneeLimit = computed(() => listAssignee.value.slice(0, 4));
        const assignee = ref({});
        const isNewConvo = ref(false);
        const { org_id, workspace_id, conversation_id } = inject('contact');
        const socket = inject('socket');
        // const envURL = !props.isDemoMode ? `${__process.env.VUE_APP_FILE_URL}/` : null;
        const envURL = new URL(
            process.env.VUE_APP_FILE_URL ? `${process.env.VUE_APP_FILE_URL}/` : `${__process.env.VUE_APP_FILE_URL}/`,
        );
        const isShowBlockComposer = ref(false);
        const clickReadAll = ref(0);

        const handleNewConvo = () => {
            isNewConvo.value = !isNewConvo.value;
        };
        const dotStatus = ref(3);
        const readAllMessage = () => {
            clickReadAll.value++;
        };

        const dragging = ref(0);
        const dragenter = (event) => {
            event.preventDefault();
            dragging.value++;
            event.currentTarget.classList.add('drap-file');
        };

        const dragover = (event) => {
            event.preventDefault();
            event.currentTarget.classList.add('drap-file');
        };

        const dragleave = (event) => {
            // Clean up
            dragging.value--;
            if (dragging.value === 0) {
                event.currentTarget.classList.remove('drap-file');
            }
        };

        const drop = (event) => {
            event.preventDefault();
            dragging.value = 0;
            emitter.emit('sendDropData', event.dataTransfer.files);
            event.currentTarget.classList.remove('drap-file');
        };

        const formatTimezone = (val) => {
            return val.replaceAll('_', ' ');
        };

        const formatReplyTime = computed(() => {
            return (content) => {
                if (content) {
                    switch (content) {
                        case 'In a few minutes':
                            return 'Typically reply in a few minutes';
                        case 'In a few hours':
                            return 'Typically reply in a few hours';
                        case 'In a few day':
                            return 'Typically reply in a day';
                        default:
                            return settings.value.reply_time;
                    }
                } else {
                    return 'Typically reply in a few minutes';
                }
            };
        });

        const formatOfficeHours = ref('');

        const greetingTextDisplay = ref('');

        const introTextDisplay = ref('');

        const indexLanguage = ref();

        watch(settings, (newVal, oldVal) => {
            if (
                newVal.welcome_message_default &&
                newVal.welcome_message_default.greating &&
                newVal.welcome_message_default.greating !== oldVal.welcome_message_default.greating
            ) {
                let text = 'greating';
                const htmlObject = document.createElement('div');
                htmlObject.innerHTML = newVal.welcome_message_default.greating;
                htmlObject.getElementsByClassName('input-tiptap__variant').forEach((element) => {
                    console.log({ element });
                    console.log(element.innerText);
                    console.log(element.childNodes);
                    console.log(element.childNodes[2]);
                    // if (element.childNodes.length==3) {
                    //     element.childNodes.shift()
                    // }
                    element.innerHTML =
                        '<' +
                        (element.childNodes[1].nodeType === 3
                            ? element.childNodes[1].nodeValue
                            : element.childNodes[2].nodeValue) +
                        '>';

                    // element.children = [element.childNodes[2]]
                });
                text = htmlObject.innerHTML;
                greetingTextDisplay.value = text;
            }

            if (
                newVal.welcome_message_default &&
                newVal.welcome_message_default.team_intro &&
                newVal.welcome_message_default.team_intro !== oldVal.welcome_message_default.team_intro
            ) {
                let text = 'team_intro';
                const htmlObject = document.createElement('div');
                htmlObject.innerHTML = newVal.welcome_message_default.team_intro;
                htmlObject.getElementsByClassName('input-tiptap__variant').forEach((element) => {
                    console.log({ element });
                    console.log(element.innerText);
                    console.log(element.childNodes);
                    console.log(element.childNodes[2]);
                    // if (element.childNodes.length==3) {
                    //     element.childNodes.shift()
                    // }
                    element.innerHTML =
                        '<' +
                        (element.childNodes[1].nodeType === 3
                            ? element.childNodes[1].nodeValue
                            : element.childNodes[2].nodeValue) +
                        '>';

                    // element.children = [element.childNodes[2]]
                });
                text = htmlObject.innerHTML;
                introTextDisplay.value = text;
            }
        });

        emitter.on('updateIndexLanguage', (val) => {
            indexLanguage.value = settings.value.welcome_message[val];
        });

        let dataDefaultMode = {};

        if (!isDemoMode) {
            const envURL = new URL(
                // eslint-disable-next-line no-use-before-define
                isDemoMode ? `${process.env.VUE_APP_FILE_URL}/` : `${__process.env.VUE_APP_FILE_URL}/`,
            );
            const { org_id, workspace_id, conversation_id } = inject('contact');
            const socket = inject('socket');
            const installDatabase = (account_id) => {
                const newVal = {};
                newVal[account_id] = [];
                /* Create emoji database */
                database.getItem(dbName.emoji, (err, value) => {
                    if (!value) {
                        database.setItem(dbName.emoji, newVal);
                    } else {
                        if (!value[account_id]) {
                            database.setItem(dbName.emoji, newVal);
                        }
                    }
                });
                /* Create list emoji database */
                database.getItem(dbName.listEmoji, (err, value) => {
                    if (!value) {
                        database.setItem(dbName.listEmoji, newVal);
                    } else {
                        if (!value[account_id]) {
                            database.setItem(dbName.listEmoji, newVal);
                        }
                    }
                });
            };
            const getListAssignee = async () => {
                const response = await getConversationAssignee(org_id, workspace_id, conversation_id);
                if (!response.error) {
                    listUser.value = response.data;
                    listAssignee.value = response.data;
                    if (listAssignee.value.length > 1) {
                        assignee.value = listAssignee.value.find((item) => item.is_joined);
                    } else {
                        assignee.value = listAssignee.value[0];
                    }
                    if (assignee.value) {
                        dotStatus.value = assignee.value.online_status;
                    }
                }
            };

            getContactInfo().then((contact) => {
                if (contact) {
                    installDatabase(contact._id);
                    emitter.emit('contactId', contact._id);
                    emitter.emit('conversationId', contact.conversation_id);
                    if (contact.status == 2) {
                        isShowBlockComposer.value = true;
                    } else if (contact.status == 1) {
                        isShowBlockComposer.value = false;
                    }
                }
            });

            const getAssigneeRealtime = (convo) => {
                const user = convo.participants.find((item) => item.parti_type === 1);
                if (user) {
                    assignee.value = listAssignee.value.find((item) => item._id === user.parti_id);
                } else {
                    if (listAssignee.value.length > 1) {
                        assignee.value = null;
                    } else {
                        assignee.value = listAssignee.value[0];
                    }
                }
                if (assignee.value) {
                    dotStatus.value = assignee.value.online_status;
                }
            };

            onMounted(async () => {
                await getListAssignee();
            });

            socket.on('incomingConversation', (data) => {
                console.log('incomingConversation', { data });
                getAssigneeRealtime(data);
                if (data && data.last_message) {
                    handleMessageFakeId(data.last_message);
                }
            });

            socket.on('incomingContactStatus', (data) => {
                if (data) {
                    if (data.contact_status == 2) {
                        isShowBlockComposer.value = true;
                    } else if (data.contact_status == 1) {
                        isShowBlockComposer.value = false;
                    }
                }
            });

            socket.on('incomingUserOnlineStatus', (data) => {
                if (listAssignee.value !== null) {
                    if (data && assignee.value && data._id === assignee.value._id) {
                        dotStatus.value = data.online_status;
                    }
                }
            });

            dataDefaultMode = {
                countNewMessage,
                showIndicatorNewMessage,
                envURL,
            };
        }

        const textOfficeHour = ref('');

        const getGreetingIntro = () => {
            if (isDemoMode && settings.value.welcome_message_select.greating)
                greetingTextDisplay.value = settings.value.welcome_message_select.greating;
            if (isDemoMode && settings.value.welcome_message_select.team_intro)
                introTextDisplay.value = settings.value.welcome_message_select.team_intro;
        };

        const formatTextHours = (val) => {
            const day = val[0].day + ' to ' + val[val.length - 1].day;

            return day;
        };

        const formatOfficeHoursWidget = (val) => {
            const dateArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const results = [];
            let flag = 0;
            for (let index = 0; index < dateArr.length; index++) {
                const item = dateArr[index];
                const find = val.find((i) => i.day === item);
                if (find) {
                    if (
                        index === 0 ||
                        (typeof results[flag][0] !== 'undefined' &&
                            JSON.stringify(find.range) === JSON.stringify(results[flag][0].range))
                    ) {
                        if (typeof results[flag] === 'undefined') {
                            results[flag] = [];
                        }
                        results[flag].push(find);
                    } else {
                        flag++;
                        if (typeof results[flag] === 'undefined') {
                            results[flag] = [];
                        }
                        results[flag].push(find);
                    }
                } else {
                    flag++;
                    if (typeof results[flag] === 'undefined') {
                        results[flag] = [];
                    }
                }
            }
            const format = results.filter((r) => r.length);

            resultsTime.value = format;
        };

        const labelTime = computed(() => {
            return (val) => {
                const dateArrWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                const dateArrWeekends = ['Saturday', 'Sunday'];
                const currentDate = val.map((i) => i.day);
                if (val.length === 7) {
                    return 'Everyday';
                } else if (JSON.stringify(currentDate) === JSON.stringify(dateArrWeekdays)) {
                    return 'Weekdays';
                } else if (JSON.stringify(currentDate) === JSON.stringify(dateArrWeekends)) {
                    return 'Weekends';
                } else {
                    if (val.length > 1) {
                        return `${val[0].day} to ${val[val.length - 1].day}`;
                    } else {
                        return val[0].day;
                    }
                }
            };
        });

        watch(settings, (newVal, oldVal) => {
            if (
                newVal.welcome_message_select &&
                newVal.welcome_message_select.greating &&
                newVal.welcome_message_select.greating !== oldVal.welcome_message_select.greating
            ) {
                let text = 'greating';
                const htmlObject = document.createElement('div');
                htmlObject.innerHTML = newVal.welcome_message_select.greating;
                htmlObject.getElementsByClassName('input-tiptap__variant').forEach((element) => {
                    // console.log({ element });
                    // console.log(element.innerText);
                    // console.log(element.childNodes);
                    // console.log(element.childNodes[2]);
                    // console.log(element.childNodes[1].nodeType);
                    // if (element.childNodes.length==3) {
                    //     element.childNodes.shift()
                    // }
                    element.innerHTML = `[
                        ${
                            element.childNodes[1].nodeType === 3
                                ? element.childNodes[1].nodeValue
                                : element.childNodes[2].nodeValue
                        }
                        ]`;
                    console.log(element.innerHTML);
                    // element.children = [element.childNodes[2]]
                });
                text = htmlObject.innerHTML;
                greetingTextDisplay.value = text;
            }

            if (
                newVal.welcome_message_select &&
                newVal.welcome_message_select.team_intro &&
                newVal.welcome_message_select.team_intro !== oldVal.welcome_message_select.team_intro
            ) {
                let text = 'team_intro';
                const htmlObject = document.createElement('div');
                htmlObject.innerHTML = newVal.welcome_message_select.team_intro;
                htmlObject.getElementsByClassName('input-tiptap__variant').forEach((element) => {
                    // console.log({ element });
                    // console.log(element.innerText);
                    // console.log(element.childNodes);
                    // console.log(element.childNodes[2]);
                    // if (element.childNodes.length==3) {
                    //     element.childNodes.shift()
                    // }
                    element.innerHTML =
                        '[' +
                        (element.childNodes[1].nodeType === 3
                            ? element.childNodes[1].nodeValue
                            : element.childNodes[2].nodeValue) +
                        ']';

                    // element.children = [element.childNodes[2]]
                });
                text = htmlObject.innerHTML;
                introTextDisplay.value = text;
            }

            if (newVal.office_hour) {
                if (newVal.office_hour !== null) {
                    if (newVal.office_hour.length == 0) formatOfficeHours.value = 'We’re available 24/7';
                    else {
                        formatOfficeHoursWidget(newVal.office_hour);
                    }
                }
            }
        });

        const formatGreetingIntro = computed(() => {
            return (content) => {
                const divNode = document.createElement('div');
                divNode.innerHTML = content;
                return divNode.innerText;
            };
        });

        onMounted(async () => {
            await getGreetingIntro();
        });

        return {
            ...dataDefaultMode,
            greetingTextDisplay,
            introTextDisplay,
            email,
            firstMessage,
            onClickCollapse,
            isErrorEmail,
            settings,
            isDemoMode,
            listAssignee,
            listAssigneeLimit,
            assignee,
            isNewConvo,
            handleNewConvo,
            isShowBlockComposer,
            readAllMessage,
            clickReadAll,
            dotStatus,
            dragover,
            dragleave,
            drop,
            dragenter,
            dragging,
            isCollapseTime,
            filters,
            onClickButton,
            formatTimezone,
            formatReplyTime,
            formatOfficeHours,
            formatGreetingIntro,
            formatTextHours,
            textOfficeHour,
            resultsTime,
            labelTime,
        };
    },
});
</script>

<style lang="scss" scoped>
.wb {
    position: fixed;
    bottom: 100px;
    right: 24px;
    display: flex;
    flex-direction: column;
    width: 376px;
    max-height: calc(100% - 20vh);
    height: 572px;
    font-family: 'Roboto', 'sans-serif';
    border-radius: 16px;
    // border: 1px solid #dadada;
    background-color: #fff;
    box-shadow: 0px 0px 0px rgba(25, 60, 143, 0.35), 0px 2px 25px rgba(25, 60, 143, 0.1);
    z-index: 9999;
    &--demo {
        position: unset;
        margin: auto;
    }
    &-header,
    &-home,
    &-header-demo {
        background: #3e6dda;
        padding: 16px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        padding-bottom: 45px;
        display: flex;
        position: relative;
        flex: 0 0 auto;
    }
    &-header {
        &-demo {
            color: white;
            display: flex;
            flex-direction: column;
            &__header {
                display: flex;
                font-size: 12px;
                line-height: 16px;
                margin-bottom: 24px;
                > img {
                    margin-right: 8px;
                }
                > div {
                    display: flex;
                    flex-direction: column;
                }
            }
            &__greeting {
                display: flex;
                flex-direction: column;
                line-height: 20px;
                &-intro {
                    font-weight: 400 !important;
                    font-size: 14px !important;
                    line-height: 20px;
                    max-height: 84px;
                    display: -webkit-box !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    :deep(*:not(.input-tiptap__variant)) {
                        white-space: pre-wrap;
                    }
                    :deep(.input-tiptap__variant) {
                        white-space: normal;
                    }
                }
                & span:nth-child(1) {
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 8px;
                }
                & span:nth-child(2) {
                    font-size: 14px;
                }
            }
            &__tooltip {
                color: #141417;
                width: 320px;
                padding: 4px 12px;
                font-size: 14px;
            }
        }
        // position: relative;
        align-items: center;
        // z-index: 1;

        span {
            margin-left: 12px;
            font-family: Roboto;
            font-style: normal;
            font-weight: bold;
            font-size: 16px;
            line-height: 24px;
            color: white;
        }
        .wb-none-assign {
            display: flex;
            align-items: center;
            &__text {
                font-family: Roboto;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                color: #ffffff;
                margin-left: 8px;
            }
            &__avatar {
                &:not(:first-child) {
                    margin-left: -14px;
                }
                &.more {
                    width: 32px;
                    height: 32px;
                    box-sizing: border-box;
                    border-radius: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    .count {
                        font-family: Roboto;
                        font-style: normal;
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 20px;
                        color: #141417;
                        margin-left: 0;
                    }
                }
            }
        }
    }
    &-content,
    &-composer {
        padding: 0 16px;
    }
    &-home-content,
    &-content,
    &-input-email {
        // position: relative;
        // flex: 1 1 60%;
        // margin-top: -15px;
        // border-top-left-radius: 16px;
        // border-top-right-radius: 16px;
        // z-index: 1;
        // overflow: auto;
        // padding-top: 16px;
        // background: #fff;
        // padding-right: 4px;
        background-color: #fff;
        margin-top: -28px;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;
        z-index: 1;
        overflow: auto;
        background: #fff;
        height: 100%;
        min-height: 50px;
        box-shadow: 0px -4px 4px rgb(25 60 143 / 24%);
        &-chat {
            padding-right: 4px;
            padding-top: 0;
            padding-bottom: 8px;
        }
    }
    &-home {
        color: white;
        text-align: center;
        padding-bottom: 80px;
        flex-grow: 1;
        &--collapse {
            // height:220px
            flex-grow: unset;
            .wb-home__avatars {
                // transform: translateY(-68px);
            }
        }
        span {
            display: block;
        }
        flex-direction: column;
        &__logo {
            align-self: center;
            width: 40px;
            height: 40px;
            margin-bottom: 16px;
        }
        &__greeting {
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
            margin-bottom: 8px;
            max-height: 84px;
            display: -webkit-box !important;
            overflow: hidden !important;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            :deep(*:not(.input-tiptap__variant)) {
                white-space: pre-wrap;
            }
            :deep(.input-tiptap__variant) {
                white-space: normal;
            }
            > div,
            span,
            p {
                font-weight: 500;
                font-size: 20px;
                line-height: 28px;
                margin-bottom: 8px;
                max-height: 84px;
                display: -webkit-box;
                overflow: hidden !important;
                text-overflow: ellipsis;
                -webkit-line-clamp: 3;
            }
        }
        &__intro {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            max-height: 84px;
            display: -webkit-box !important;
            overflow: hidden !important;
            text-overflow: ellipsis;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            :deep(*:not(.input-tiptap__variant)) {
                white-space: pre-wrap;
            }
            :deep(.input-tiptap__variant) {
                white-space: normal;
            }
        }
        &__avatars {
            height: 64px;
            position: absolute;
            z-index: 2;
            bottom: 0;
            width: 344px;
            > img {
                margin: auto;
            }
            &-blur {
                position: absolute;
                background: linear-gradient(180deg, rgba(62, 109, 218, 0) 0%, #3e6dda 59.37%);
                width: 100%;
                height: 32px;
                z-index: -1;
                opacity: 0.7;
            }
        }
        &-content {
            padding: 0 16px;
            padding-top: 24px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            overflow: initial;
            &--collapse {
                // transform: translateY(-68px);
                height: 185px;
                flex-grow: 1;
            }
            > div {
                display: flex;
                flex-direction: column;
            }
            &__title {
                display: block;
                color: #141417;
                font-size: 14px;
                line-height: 20px;
                font-weight: 400;
                margin-bottom: 12px;
            }
            &__times {
                font-size: 12px;
                line-height: 16px;
                color: #555562;
                margin-bottom: 12px;
                display: flex;
                flex-direction: column;
                text-align: center;
                &-collapse {
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #3e6dda;
                }
            }
            &__timezone {
                color: #828292;
            }
        }
        &-button {
            display: flex;
            justify-content: center;
            font-weight: 500;
            font-size: 14px;
            line-height: 40px;
            > span {
                cursor: pointer;
                display: block;
                background: #3e6dda;
                width: 303px;
                height: 40px;
                left: 0px;
                top: 300px;
                border-radius: 40px;
                color: white;
                text-align: center;
                &:hover {
                    background: #1b3d8d;
                }
                &:active {
                    background: #1b3d8d;
                    box-shadow: 0px 0px 0px 2px #bfcef3 inset;
                }
            }
        }
        &--ip-email {
            padding-bottom: 60px;
        }
    }
    &-input-email {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 24px;
        padding-bottom: 16px;
        overflow: hidden;
        & > div:nth-child(1) {
            margin-bottom: 16px;
            span {
                display: block;
                margin-top: 4px;
                color: #ec2b08;
                font-size: 14px;
            }
        }
        & > div:nth-child(2) {
            // height: 108px;
        }
        &-button {
            display: flex;
            justify-content: center;
            font-weight: 500;
            font-size: 14px;
            line-height: 40px;

            > span {
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #3e6dda;
                width: 303px;
                height: 40px;
                left: 0px;
                top: 300px;
                border-radius: 40px;
                color: white;
                text-align: center;
                > &:hover {
                    background: #1b3d8d;
                }
                &:active {
                    background: #1b3d8d;
                    box-shadow: 0px 0px 0px 2px #bfcef3 inset;
                }
                > span {
                    margin-left: 4px;
                }
            }
            &--disabled {
                > span {
                    background: #bfcef3 !important;
                    cursor: not-allowed;
                }
            }
        }
    }
    &-composer {
        textarea {
            resize: none;
            width: 100%;
            outline: none;
            border: none;
            background: #f2f2f2;
            font-size: 14px;
            height: 20px;
            font-family: 'Roboto', 'sans-serif';
            ::placeholder {
                font-family: 'Roboto', 'sans-serif';
            }
        }
        &__send-icon {
            cursor: pointer;
        }
        margin: 0 16px;
        background: #f2f2f2;
        display: flex;
        align-items: center;
        border-radius: 20px;
        height: 40px;
    }
    &-trademark {
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        color: #b4b4be;
        padding: 12px 0;
        display: flex;
        justify-content: center;
    }
    &-box-content {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: hidden;
    }
    &-block {
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        padding-top: 16px;
        padding-bottom: 4px;
        margin: 0;
        border-top: 1px solid #e9e9ec;
        color: #828292;
    }
    &.drap-file {
        .wb-content {
            .message-content {
                pointer-events: none;
                opacity: 0.6;
            }
        }
        .widget-composer__img {
            pointer-events: none;
            opacity: 0.6;
        }
        .widget-composer__container {
            pointer-events: none;
            opacity: 0.6;
        }
        .wb-trademark {
            pointer-events: none;
            opacity: 0.6;
        }
    }
}
.indicator-new-message {
    font-weight: 500;
    border-radius: 16px;
    position: absolute;
    bottom: 99px;
    left: 50%;
    transform: translateX(-50%);
    line-height: 18px;
    z-index: 9;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 2px 10px rgba(0, 0, 0, 0.1);
    padding: 6px 12px;
    --bg-opacity: 1;
    background-color: #f6f6f8;

    img {
        display: inline-block;
        margin-right: 9px;
        image-rendering: pixelated;
        vertical-align: middle;
    }

    span {
        font-size: 14px;
        line-height: 20px;
        --text-opacity: 1;
        color: #141417;
    }
}
.indicator-new-message:hover {
    cursor: pointer;
}
::-webkit-scrollbar {
    cursor: pointer;
    width: 16px;
}
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 16px 16px transparent;
    border: solid 4px transparent;
}
::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 16px 16px #b4b4be;
    border: solid 4px transparent;
    border-radius: 16px;
}

::-webkit-scrollbar-button {
    display: none;
}
//::-webkit-scrollbar-thumb:hover {
//    // background: #c3c3c3;
//    box-shadow: inset 0 0 16px 16px #c3c3c3;
//}
</style>