<template>
    <button class="custom-select-assign relative" v-click-outside="closeOption">
        <div class="flex items-center text-14 font-medium">
            <span :class="{'text-neutrals-200':blockAssign}">{{ $t('inbox.inbox_select_assign_to') }}</span>
            <div class="selected w-20 h-20 ml-8p" @click="open = !open">
                <template v-if="checkAssigned">
                    <template v-if="checkAvatar">
                        <div
                            class="mr-8p 111 relative select-list__item-img w-20 h-20 flex items-center justify-center border border-solid border-neutrals-100 rounded-50%"
                            :style="{ backgroundColor: avatarAssign !== '' ? '' : getBgUserName }"
                        >
                            <img class="rounded-50%" :src="envURL + '/' + avatarAssign" />
                            <span
                                v-if="isStatusDot !== 3"
                                class="status-dot"
                                :class="{
                                    'online bg-success-3': isStatusDot === 1,
                                    'idle bg-warning-3': isStatusDot === 5,
                                }"
                            ></span>
                        </div>
                    </template>
                    <template v-else>
                        <avatar-component
                            :bgAvatar="getBgUserName"
                            class="11112344"
                            size="xs"
                            :label-show="false"
                            :label-avatar="getUsername"
                            :online="isStatusDot"
                        />
                    </template>
                </template>
                <template v-else>
                    <div
                        class="border border-solid border-neutrals-100 rounded-50% bg-neutrals-300 h-full flex items-center justify-center"
                    >
                        <img class="img-default" src="@/assets/images/vector.png" />
                    </div>
                </template>
            </div>
        </div>
        <div class="select-list absolute right-0 pb-8p bg-white" v-show="blockAssign ? false : open">
            <div class="option-search p-8p">
                <Input
                    v-model="textSearch"
                    :state="state"
                    type="text"
                    :placeholder="$t('inbox.inbox_select_assign_placeholder_serach')"
                >
                    <template v-slot:prefix>
                        <icon-comp width="13" height="14" name="Search"></icon-comp>
                    </template>
                    <template v-slot:suffix>
                        <icon-comp
                            v-show="textSearch"
                            class="cursor-pointer"
                            name="Times"
                            @click="textSearch = ''"
                        ></icon-comp>
                    </template>
                </Input>
            </div>
            <slot v-if="!searchQuery.length">
                <span class="block text-left text-14 text-neutrals-400 py-8p px-16p">{{
                    $t('inbox.inbox_select_assign_no_data')
                }}</span>
            </slot>
            <slot v-else>
                <ul class="scrollbar--transparent overflow-y-auto max-h-146 px-8p" ref="heightList">
                    <li
                        class="select-list__item cursor-pointer text-neutrals-900 py-8p px-12p hover:bg-neutrals-50 rounded flex items-center justify-between"
                        v-for="(option, i) of searchQuery"
                        :key="i"
                        :class="{ checked: checkSelected(option) }"
                        @click="chooseValue(option)"
                    >
                        <span class="flex items-center text-14 truncate w-full mr-10p">
                            <template v-if="option.username == 'None'">
                                <div
                                    class="w-20 h-20 border-solid border-neutrals-100 rounded-50% bg-neutrals-300 flex items-center justify-center"
                                >
                                    <img class="img-default" src="@/assets/images/vector.png" />
                                </div>
                            </template>
                            <template v-else-if="option.username == 'You'">
                                <template v-if="option.avatar_src">
                                    <div
                                        class="select-list__item-img relative w-20 h-20 flex items-center justify-center border border-solid border-neutrals-100 rounded-50%"
                                        :style="{ backgroundColor: option.avatar_src !== '' ? '' : getBgUserName }"
                                    >
                                        <img class="rounded-50%" :src="envURL + '/' + option.avatar_src" />
                                        <span
                                            v-if="isStatusDot !== 3"
                                            class="status-dot"
                                            :class="{
                                                'online bg-success-3': isStatusDot === 1,
                                                'idle bg-warning-3': isStatusDot === 5,
                                            }"
                                        ></span>
                                    </div>
                                </template>
                                <template v-else>
                                    <avatar-component
                                        class="11"
                                        :bgAvatar="option.avatar_bg"
                                        size="xs"
                                        :label-show="false"
                                        :label-avatar="convertUsername(option)"
                                        :online="isStatusDot"
                                    />
                                </template>
                            </template>
                            <template v-else>
                                <template v-if="option.avatar_src">
                                    <div
                                        class="select-list__item-img relative w-20 h-20 flex items-center justify-center border border-solid border-neutrals-100 rounded-50%"
                                        :style="{ backgroundColor: option.avatar_src !== '' ? '' : getBgUserName }"
                                    >
                                        <img class="rounded-50%" :src="envURL + '/' + option.avatar_src" />
                                        <span
                                            v-if="option.online_status !== 3"
                                            class="status-dot"
                                            :class="{
                                                'online bg-success-3': option.online_status === 1,
                                                'idle bg-warning-3': option.online_status === 5,
                                            }"
                                        ></span>
                                    </div>
                                </template>
                                <template v-else>
                                    <avatar-component
                                        class="11"
                                        :bgAvatar="option.avatar_bg"
                                        size="xs"
                                        :label-show="false"
                                        :label-avatar="convertUsername(option)"
                                        :online="option.online_status"
                                    />
                                </template>
                            </template>
                            <span class="truncate select-list__item-name">{{ option.username }}</span>
                        </span>
                        <icon-comp v-if="checkSelected(option)" name="check" color="primary-500"></icon-comp>
                    </li>
                </ul>
            </slot>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch, inject } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { store } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { routerPush } from '@/router';
import { useSocket } from '@/composables/useSocket';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';

export default defineComponent({
    name: 'Select Component',
    components: {
        Input,
        IconComp,
        AvatarComponent,
    },
    props: {
        options: {
            type: Array,
            // required: true,
            default: () => [],
        },
        modelValue: {
            type: String,
            default: '',
        },
        blockAssign: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['change', 'update:modelValue'],
    data() {
        return {};
    },
    setup(props, { emit }) {
        // const selected = ref<any>(props.modelValue ? props.modelValue : '');
        const { getAssignUser, errorRes } = useInbox();
        const listAssign = ref<any>([]);
        const open = ref<boolean>(false);
        const { _id: userId } = store.state.auth.user;
        const textSearch = ref(''),
            state = ref('default');
        const route = useRoute();
        const convoId: any = computed(() => route.params.conversation);
        const envURL = process.env.VUE_APP_FILE_URL;
        const { socket } = useSocket();
        const emitter: any = inject('emitter');
        const router = useRouter();
        const heightList = ref(null);
        const { conversationDetail } = useInboxConversationDetail();

        const isMaxHeight = computed(() => {
            if (heightList.value) {
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                const height = (heightList as any).value.clientHeight;
                if (height > 146) return true;
                else return false;
            } else return false;
        });

        const selected = computed({
            get: () => props.modelValue,
            set: value => {
                return emit('update:modelValue', value);
            },
        });

        const userStore = computed(() => {
            return store.state.auth.user;
        });

        onMounted(async () => {
            const info: any = await getAssignUser('me');
            const paramNone = {
                username: 'None',
                avatar_src: '',
                _id: '',
            };
            const convertUser = JSON.parse(JSON.stringify(userStore.value));

            if (!errorRes.value) {
                listAssign.value = info;
                listAssign.value = [paramNone, convertUser, ...listAssign.value];
            } else {
                listAssign.value = [paramNone, convertUser];
            }
        });

        const chooseValue = async (val: any) => {
            open.value = false;
            const value = {
                username: val.username,
                user_id: val._id,
            };
            emit('change', value);
            textSearch.value = '';
        };

        const checkSelected = computed(() => {
            return (option: any) => {
                const assignCurrentUser = conversationDetail.value.participants.filter((p: any) => p.parti_type === 1);
                if (assignCurrentUser.length < 1) {
                    return option.username === 'None';
                } else {
                    if (assignCurrentUser[0]['parti_id'] == '' && option.username === 'None') return true;
                    return option._id === assignCurrentUser[0]['parti_id'];
                }
            };
        });

        const checkAssigned = computed(() => {
            const assignCurrentUser = conversationDetail.value.participants.filter((p: any) => p.parti_type === 1);
            return assignCurrentUser.length > 0 && assignCurrentUser[0]['parti_id'] != '';
        });

        const cloneAssignList = computed(() => {
            if (listAssign.value) {
                const convertListAssign = JSON.parse(JSON.stringify(listAssign.value));
                const objIndex = convertListAssign.findIndex((obj: any) => obj._id == userId);
                if (convertListAssign[objIndex]) {
                    convertListAssign[objIndex].username = 'You';
                    return convertListAssign;
                }
            }
            return listAssign.value;
        });

        const searchQuery = computed(() => {
            if (listAssign.value) {
                const convertListAssign = JSON.parse(JSON.stringify(listAssign.value));
                const objIndex = convertListAssign.findIndex((obj: any) => obj._id == userId);
                if (convertListAssign[objIndex]) {
                    convertListAssign[objIndex].username = 'You';
                    if (textSearch.value) {
                        return convertListAssign.filter((item: any) => {
                            const res = item.username.toLowerCase().includes(textSearch.value.toLowerCase());
                            return res;
                        });
                    } else {
                        return convertListAssign;
                    }
                }
            }
            return listAssign.value;
        });

        // const getUsername = computed(() => {
        //     const getSelect = listAssign.value.filter((item: any) => item.username === selected.value);
        //     if (getSelect.length) {
        //         return JSON.parse(JSON.stringify(getSelect))[0].username;
        //     }
        //     return '';
        // });

        const checkAvatar = computed(() => {
            const assignCurrentUser = conversationDetail.value.participants.filter((p: any) => p.parti_type === 1);
            if (assignCurrentUser.length < 1) {
                return false;
            } else {
                if (assignCurrentUser[0]['parti_id'] == '') return false;
                const getSelect = cloneAssignList.value.filter(
                    (item: any) => item._id === assignCurrentUser[0]['parti_id'],
                );
                if (getSelect.length) {
                    const convertGetSelect = JSON.parse(JSON.stringify(getSelect));
                    if (convertGetSelect[0].avatar_src) return true;
                    else return false;
                }
            }
            return false;
        });

        const avatarAssign = computed(() => {
            const assignCurrentUser = conversationDetail.value.participants.filter((p: any) => p.parti_type === 1);
            if (assignCurrentUser.length < 1) {
                return '';
            } else {
                if (assignCurrentUser[0]['parti_id'] == '') return '';
                const getSelect = cloneAssignList.value.filter(
                    (item: any) => item._id === assignCurrentUser[0]['parti_id'],
                );
                if (getSelect.length) {
                    return JSON.parse(JSON.stringify(getSelect))[0].avatar_src;
                }
            }
            return '';
        });

        const getUsername = computed(() => {
            const assignCurrentUser = conversationDetail.value.participants.filter((p: any) => p.parti_type === 1);
            if (assignCurrentUser.length < 1) {
                return '';
            } else {
                if (assignCurrentUser[0]['parti_id'] == '') return '';
                const getSelect = cloneAssignList.value.filter(
                    (item: any) => item._id === assignCurrentUser[0]['parti_id'],
                );
                if (getSelect.length) {
                    const getConvertUsername = listAssign.value.filter((item: any) => {
                        return item._id === getSelect[0]._id;
                    });
                    if (getConvertUsername.length) return getConvertUsername[0].username;
                }
            }
            return '';
        });

        const getBgUserName = computed(() => {
            const assignCurrentUser = conversationDetail.value.participants.filter((p: any) => p.parti_type === 1);
            if (assignCurrentUser.length < 1) {
                return '';
            } else {
                if (assignCurrentUser[0]['parti_id'] == '') return '';
                const getSelect = cloneAssignList.value.filter(
                    (item: any) => item._id === assignCurrentUser[0]['parti_id'],
                );
                if (getSelect.length) {
                    const getConvertUsername = listAssign.value.filter((item: any) => {
                        return item._id === getSelect[0]._id;
                    });
                    if (getConvertUsername.length) return getConvertUsername[0].avatar_bg;
                }
            }
            return '';
        });

        const convertUsername = (val: any) => {
            if (val.username === 'You') {
                const getConvertUsername = listAssign.value.filter((item: any) => {
                    return item._id === val._id;
                });
                return getConvertUsername[0].username;
            } else return val.username;
        };

        const isStatusDot = ref<number>(userStore.value && userStore.value.online_status);

        const closeOption = (e: any) => {
            open.value = false;
            textSearch.value = '';
        };

        watch(router.currentRoute, () => {
            isStatusDot.value = 1;
        });

        socket.on('incomingUserOnlineStatus', (data: any) => {
            if (data) {
                // const convertListAssign = JSON.parse(JSON.stringify(listAssign.value));
                const getAssignUser = listAssign.value.filter((item: any) => item._id === data._id);
                if (getAssignUser.length > 0) {
                    const objIndex = listAssign.value.findIndex((obj: any) => obj._id == data._id);
                    if (objIndex === 1) {
                        isStatusDot.value = data.online_status;
                        emitter.emit('sendStatusUser', data.online_status);
                    } else {
                        if ((listAssign as any).value[objIndex]) {
                            (listAssign as any).value[objIndex].online_status = data.online_status;
                        }
                        return listAssign.value;
                    }
                }
            }
        });

        emitter.on('dotStatusUser', (data: number) => {
            isStatusDot.value = data;
            const params = {
                workspace_id: store.state.auth.user.workspace_id,
                user_id: store.state.auth.user._id,
            };
            if (data === 5) {
                socket.emit('sendIdleStatus', params);
            } else if (data === 1) {
                socket.emit('sendOnlineStatus', params);
            }
        });

        watch(router.currentRoute, () => {
            isStatusDot.value = 1;
        });

        return {
            selected,
            open,
            state,
            textSearch,
            searchQuery,
            listAssign,
            checkAvatar,
            chooseValue,
            avatarAssign,
            getUsername,
            convertUsername,
            getBgUserName,
            envURL,
            closeOption,
            isStatusDot,
            userStore,
            cloneAssignList,
            heightList,
            isMaxHeight,
            checkSelected,
            checkAssigned,
        };
    },
    // methods: {
    //     closeOption(e: any) {
    //         this.open = false;
    //         this.textSearch = '';
    //     },
    // },
});
</script>

<style lang="scss">
.custom-select-assign {
    cursor: unset;
    &:focus {
        outline: none;
    }
    .selected {
        cursor: pointer;
    }
    .img-selected {
        height: 100%;
        > img {
            height: 100%;
            object-fit: contain;
            width: 100%;
            background: #e9e9ec;
            border-radius: 50%;
            border: 1px solid #e9e9ec;
        }
    }
    .img-default {
        width: 7px;
        height: 10px;
    }
    .select-list {
        width: 256px;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        top: 38px;
        &__item {
            &.checked {
                font-weight: 500;
                color: #3e6dda;
            }
            &-name {
                width: calc(100% - 28px);
                text-align: left;
                margin-left: 8px;
            }
            &-img {
                img {
                    height: 100%;
                    object-fit: cover;
                    width: 100%;
                }
                .status-dot {
                    width: 6px;
                    height: 6px;
                    position: absolute;
                    bottom: -1px;
                    right: -1px;
                    border-radius: 50%;
                    box-sizing: content-box;
                    border: 1px solid #ffffff;
                }
            }
        }
    }
}
</style>
