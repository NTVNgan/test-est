<template>
    <div class="setting-teammate py-24p px-40p h-full w-full relative">
        <div class="text-24 font-semibold flex items-center justify-between">
            <h2 class="text-24 font-heading">{{ $t('setting.teammate_title') }}</h2>
        </div>
        <div class="flex justify-between items-center mt-32p">
            <div class="w-300">
                <input-comp
                    class="flex-grow"
                    v-model="searchValue"
                    closeIcon
                    v-on:keyup.enter="onEnterSearch"
                    placeholder="Search teammate"
                >
                    <template v-slot:prefix>
                        <icon-comp name="search"></icon-comp>
                    </template>
                </input-comp>
            </div>
            <button-component class="ml-16p" @click="isShowModalInviteTeammate = true">
                {{ $t('setting.teammate_button_invite_teammate') }}
            </button-component>
        </div>
        <div class="text-14 my-16p">
            <skeleton-box v-if="loading" width="80px" />
            <template v-else-if="status !== 'init'">
                <b>{{ total ? total : 0 }}</b>
                <span class="text-neutrals-400">
                    {{ total > 1 ? ' teammates' : ' teammate' }}
                </span>
            </template>
        </div>
        <template v-if="status == 'searching' || (status === 'search' && teammatesByKeyword.length !== 0)">
            <div class="setting-teammate__data">
                <new-table-component
                    class="setting-teammate__data-table"
                    :loading="!next_page && loading"
                    :loadingRow="isLoadMore"
                    :columns="columns"
                    :data-source="teammatesByKeyword"
                    :nextPage="next_page"
                    :scrollToBottom="onScrollToBottom"
                >
                    <template v-slot:loading>
                        <setting-teammate-table-skeleton-component />
                    </template>
                    <template v-slot:name="{ record }">
                        <div class="flex items-center">
                            <div class="whitespace-nowrap overflow-hidden flex items-center">
                                <avatar-component
                                    v-if="userStore?._id === record.id"
                                    :labelShow="false"
                                    :label-avatar="record.full_name"
                                    :bgAvatar="record.avatar_bg"
                                    size="medium"
                                    :image="record.avatar_src ? `${envURL}${record.avatar_src}` : ''"
                                    :online="record.online_status"
                                />
                                <avatar-component
                                    v-else
                                    :labelShow="false"
                                    :label-avatar="record.full_name"
                                    :bgAvatar="record.avatar_bg"
                                    size="medium"
                                    :image="record.avatar_src ? `${envURL}${record.avatar_src}` : ''"
                                    :online="record.online_status"
                                />
                                <div class="inline-block text-left flex flex-col text-14p ml-16p">
                                    <span class="truncate">{{ record.full_name }}</span>
                                    <span class="font-normal truncate">{{ record.email }}</span>
                                </div>
                            </div>
                            <div class="ml-40p">
                                <tag-component
                                    v-if="
                                        record.status === STATUS_USER.EXPIRED_EMAIL ||
                                        record.status === STATUS_USER.INACTIVED_EMAIL
                                    "
                                    class="ml-40p"
                                    :error="record.status === STATUS_USER.EXPIRED_EMAIL"
                                    >{{
                                        record.status === STATUS_USER.EXPIRED_EMAIL
                                            ? 'Expired invitation'
                                            : 'Pending activation'
                                    }}</tag-component
                                >
                            </div>
                        </div>
                    </template>
                    <template v-slot:role_name="{ record }">
                        <setting-dropdown
                            :ref="`role_name${record.id}`"
                            :key="`role_name${record.id}`"
                            :id="`role_name${record.id}`"
                            width="208px"
                            height="124px"
                            :disabled="record.is_root"
                        >
                            <template #header>
                                <div
                                    class="flex items-center"
                                    :class="!record.is_root ? 'hover:text-primary-500 ' : 'text-neutrals-300'"
                                >
                                    <template v-if="record.is_root">
                                        Super admin
                                        <icon-angle-down color="neutrals-300" class="icon-svg fill-current ml-8p" />
                                    </template>
                                    <template v-else>
                                        <span class="mr-8p cursor-pointer">{{
                                            roles.find((item) => item._id === record.role_id)?.name
                                        }}</span>
                                        <icon-angle-down class="icon-svg fill-current mr-8p" />
                                    </template>
                                </div>
                            </template>
                            <template #content>
                                <div
                                    class="
                                        flex flex-col
                                        cursor-pointer
                                        text-neutrals-900
                                        py-8p
                                        px-12p
                                        active:text-primary-500
                                        focus:bg-primary-50
                                        active:bg-primary-50
                                        rounded
                                    "
                                    :class="
                                        item._id === record.role_id
                                            ? `text-primary-500 bg-primary-50`
                                            : `hover:bg-neutrals-50 focus:text-primary-500`
                                    "
                                    v-for="(item, index) in roles"
                                    :key="index"
                                    @click="onChangeRole({ record, role_id: item._id })"
                                >
                                    <span
                                        class="font-medium"
                                        :class="{
                                            'text-primary-500': item._id === record.role_id,
                                        }"
                                        >{{ item.name }}</span
                                    >
                                    <span
                                        class="text-12"
                                        :class="item._id === record.role_id ? 'text-primary-300' : 'text-neutrals-300'"
                                        >{{
                                            item.name === 'Admin'
                                                ? $t('setting.teammate_role_admin_description')
                                                : $t('setting.teammate_role_agent_description')
                                        }}
                                    </span>
                                </div>
                            </template>
                        </setting-dropdown>
                    </template>
                    <template v-slot:action="{ record }">
                        <setting-dropdown
                            v-if="record.status !== STATUS_USER.ACTIVATED"
                            :key="record.id"
                            :id="record.id"
                            width="188px"
                        >
                            <template #header>
                                <button-component
                                    type="subtle"
                                    size="small"
                                    isFocus
                                    icon="ellipsisH"
                                ></button-component>
                            </template>
                            <template #content>
                                <div
                                    v-if="record.status === STATUS_USER.EXPIRED_EMAIL"
                                    class="
                                        flex
                                        items-center
                                        cursor-pointer
                                        text-neutrals-900
                                        py-8p
                                        px-12p
                                        hover:bg-neutrals-50
                                        focus:bg-primary-50
                                        active:bg-primary-50
                                        rounded
                                    "
                                    @click="onToggleResendEmail(record)"
                                >
                                    <icon-redo class="icon-svg fill-current text-neutrals-500 mr-8p" />
                                    <span>{{ $t('setting.teammate_action_resend') }}</span>
                                </div>
                                <div
                                    class="
                                        flex
                                        items-center
                                        cursor-pointer
                                        text-neutrals-900
                                        py-8p
                                        px-12p
                                        hover:bg-neutrals-50
                                        focus:bg-primary-50
                                        active:bg-primary-50
                                        rounded
                                    "
                                    @click="onToggleEditEmail(record)"
                                >
                                    <icon-edit class="icon-svg fill-current text-neutrals-500 mr-8p" />
                                    <span>{{ $t('setting.teammate_action_edit') }}</span>
                                </div>
                                <div
                                    class="
                                        flex
                                        items-center
                                        cursor-pointer
                                        text-neutrals-900
                                        py-8p
                                        px-12p
                                        hover:bg-neutrals-50
                                        focus:bg-primary-50
                                        active:bg-primary-50
                                        rounded
                                    "
                                    @click="onDeleteInvitation(record)"
                                >
                                    <icon-trash class="icon-svg fill-current text-neutrals-500 mr-8p" />
                                    <span>{{ $t('setting.teammate_action_delete') }}</span>
                                </div>
                            </template>
                        </setting-dropdown>
                        <button-component
                            v-else
                            @click="onToggleDeleteRecord(record)"
                            type="subtle"
                            size="small"
                            icon="trash"
                            :disabled="record.is_root || userStore?._id === record.id"
                        ></button-component>
                    </template>
                </new-table-component>
            </div>
        </template>
        <template v-else-if="!['init', 'seaching'].includes(status) && teammatesByKeyword.length === 0">
            <div class="setting-teammate__no-data relative flex flex-col justify-center items-center">
                <div class="w-inherit">
                    <img class="logo mx-auto w-120 h-120" src="../../contact/images/no-data.svg" alt="banner" />
                    <div class="text-center w-min truncate">
                        {{ $t('contact.contact_list_search_title_empty', { searchedValue }) }}<br />
                        {{ $t('contact.contact_list_search_title2_empty') }}
                    </div>
                </div>
            </div>
        </template>
        <modal-invite-teammate
            v-if="total < 200"
            v-model:showModal="isShowModalInviteTeammate"
            :totalTeammate="total"
            @close="() => (isShowModalInviteTeammate = false)"
        />
        <modal-maximum-teammate
            v-if="total === 200"
            v-model:showModal="isShowModalInviteTeammate"
            @close="() => (isShowModalInviteTeammate = false)"
            :closeIcon="false"
        />
        <modal-expire-resend-invite
            v-model:showModal="isShowModalExpireResendInvite"
            @close="() => (isShowModalExpireResendInvite = false)"
            :closeIcon="false"
        />
        <modal-edit-email
            v-model:showModal="isShowEditEmail"
            :teammate="selectedEditEmailRecord"
            @showModalEditActivedEmail="() => (isShowModalEditActivedEmail = true)"
            @showModalErrorDeletedRecord="onShowModalDeletedRecord"
            @onEditEmail="onEditEmail"
            @close="() => (isShowEditEmail = false)"
        />
        <modal-edit-activated
            v-model:showModal="isShowModalEditActivedEmail"
            @close="() => (isShowModalEditActivedEmail = false)"
            :closeIcon="false"
        />
        <modal-error-deleted-record
            v-model:showModal="isShowModalErrorDeletedRecord"
            @close="() => (isShowModalErrorDeletedRecord = false)"
            :recordType="errorDeletedRecordType"
            :closeIcon="false"
        />
        <modal-handover
            v-model="isShowHandover"
            :teammates="userListCustom"
            :value="selectedDeleteRecord"
            @close="() => (isShowHandover = false)"
            @delete-success="onDeleteSuccessFromModalHandover"
        />
    </div>
</template>

<script lang="ts">
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import TagComponent from '@/components/ui/TagComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import InputComp from '@/components/ui/InputComponent.vue';
import { ref, watch, reactive, toRefs, onActivated, inject, computed, onMounted, onUnmounted } from 'vue';
import { columnItem } from '@/types/table';
import SettingDropdown from '../components/SettingTeammateDropdown.vue';
import IconTrash from '@/components/icons/Trash.vue';
import IconEdit from '@/components/icons/Edit.vue';
import IconRedo from '@/components/icons/Redo.vue';
import IconAngleDown from '@/components/icons/AngleDown.vue';
import ModalInviteTeammate from '../components/SettingTeammateModalInviteTeammate.vue';
import ModalExpireResendInvite from '../components/SettingTeammateModalExpireResendInvite.vue';
import ModalMaximumTeammate from '../components/SettingTeammateModalMaximumTeammate.vue';
import ModalEditActivated from '../components/SettingTeammateModalEditActivatedEmail.vue';
import ModalErrorDeletedRecord from '../components/SettingTeammateModalErrorDeletedRecord.vue';
import ModalEditEmail from '../components/SettingTeammateModalEditEmail.vue';
import ModalHandover from '../components/SettingTeammateModalHandover.vue';
import SettingTeammateTableSkeletonComponent from '../components/SettingTeammateTableSkeletonComponent.vue';
import { useSocket } from '@/composables/useSocket';
import { useTeammate } from '../composables/useTeammate';
import { useUser } from '@/modules/auth/composables/useUser';
import { STATUS, STATUS as STATUS_USER } from '@/constant/user';
import debounce from 'lodash/debounce';
import { useRole } from '@/composables/useRole';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { store } from '@/store';
import { useRouter } from 'vue-router';
import { useSocketAction } from '@/composables/useSocketAction';

export default {
    name: 'SettingTeammate',
    components: {
        SettingTeammateTableSkeletonComponent,
        AvatarComponent,
        IconAngleDown,
        IconTrash,
        IconEdit,
        IconRedo,
        NewTableComponent,
        IconComp,
        ButtonComponent,
        InputComp,
        SettingDropdown,
        TagComponent,
        ModalEditEmail,
        ModalHandover,
        ModalInviteTeammate,
        ModalMaximumTeammate,
        ModalExpireResendInvite,
        ModalEditActivated,
        ModalErrorDeletedRecord,
        SkeletonBox,
    },
    setup() {
        // const LIFE_TIME_SIGN_URL = 5 * 60 * 1000;
        const LIFE_TIME_SIGN_URL = 24 * 60 * 60 * 1000;
        const { t } = useI18n();
        const defaultColumns: columnItem[] = [
            {
                title: t('setting.teammate_table_title_name'),
                dataIndex: 'name',
                slots: {
                    title: 'nameTitle',
                },
                scopedSlots: { customRender: 'name' },
            },
            {
                title: t('setting.teammate_table_title_role'),
                dataIndex: 'role_name',
                slots: {
                    title: 'role_nameTitle',
                },
                scopedSlots: { customRender: 'role_name' },
                width: '144px',
            },
            {
                title: ' ',
                dataIndex: 'action',
                slots: {
                    title: 'actionTitle',
                },
                scopedSlots: { customRender: 'action' },
                width: '72px',
            },
        ];
        const searchValue = ref<string>('');
        const status = ref('init');
        const searchedValue = ref<string | null>('');
        const teammatesByKeyword = ref<any>([]);
        const columns = ref<columnItem[]>(defaultColumns);
        const next_page = ref(null);
        const total = ref<any>(null);
        const isLoadMore = ref(false);
        const isSearchByEnter = ref(false);
        const isShowModalInviteTeammate = ref(false);
        const isShowModalExpireResendInvite = ref(false);
        const isShowModalEditActivedEmail = ref(false);
        const isShowModalErrorDeletedRecord = ref(false);
        const isShowEditEmail = ref(false);
        const isShowHandover = ref(false);
        const selectedEditEmailRecord = ref<Teammate | null>(null);
        const selectedDeleteRecord = ref<Teammate | null>(null);
        const { teammates, getTeammatesByKeyword, resendEmailTeammate, loading, getInviteTeammateList } = useTeammate();
        const envURL = `${process.env.VUE_APP_FILE_URL}/`;
        const { roles, loading: loadingRoute, getRole } = useRole();
        const { socket } = useSocket();
        const { updateUserByID, deleteUserByID, userList: usersActive } = useUser();
        const inviteTeammateList = ref<any>(null);
        const errorDeletedRecordType = ref<any>('nothing');
        const intervalTime = ref<any>();
        const { addToast } = useToast();
        const emitter: any = inject('emitter');
        const router = useRouter();
        const userStore = computed(() => {
            return store.state.auth.user;
        });
        const { addActionRoleChange } = useSocketAction();

        const userListCustom = computed(() => {
            if (Array.isArray(usersActive.value)) {
                usersActive.value.forEach((u) => {
                    u.id = u._id;
                });
            }
            return usersActive.value;
        });

        const refreshData = () => {
            next_page.value = null;
            total.value = null;
            teammatesByKeyword.value = [];
        };

        const getRoleOfTeammate = (id: string) => {
            if (id && roles.value) {
                roles.value.find((item: any) => item.id === id);
            }
        };

        const onGetInviteTeammateList = async () => {
            try {
                const data: any = await getInviteTeammateList();
                inviteTeammateList.value = data.data;
            } catch (e) {
                console.log({ e });
            }
        };

        const onSearchTeammates = async function (q: string | null) {
            if (q !== searchedValue.value) {
                refreshData();
                searchedValue.value = q;
            }
            status.value = 'searching';
            const data = await getTeammatesByKeyword({
                q,
                next_page: next_page.value,
                per_page: 20,
                include_statuses: '1|3',
            });
            status.value = 'search';

            teammatesByKeyword.value = [...teammatesByKeyword.value, ...data.data].map((item) => {
                // console.log('start ', item.status);
                // console.log('invite teammate ', inviteTeammateList.value[item.id]);
                if (inviteTeammateList.value[item.id]) {
                    item.send_at = inviteTeammateList.value[item.id].send_at;
                    if (item.status === STATUS_USER.INACTIVED) {
                        // NOTE: 1 equals pending, 5 equals expired
                        if (inviteTeammateList.value[item.id].status === 1) {
                            item.status = STATUS_USER.INACTIVED_EMAIL;
                        }
                        if (inviteTeammateList.value[item.id].status === 5) {
                            item.status = STATUS_USER.EXPIRED_EMAIL;
                        }
                    }
                }
                // console.log(item.full_name, item.status);

                return item;
            });

            next_page.value = data.next_page;
            total.value = data.total;
        };

        const changeStatusUser = () => {
            if (teammatesByKeyword.value) {
                const getUserIndex = teammatesByKeyword.value.findIndex((item: any) => item.id === userStore.value._id);
                if ((teammatesByKeyword as any).value[getUserIndex]) {
                    (teammatesByKeyword as any).value[getUserIndex].online_status = 1;
                }
                return teammatesByKeyword.value;
            }
        };

        const onEnterSearch = debounce((e) => {
            refreshData();
            isSearchByEnter.value = true;
            onSearchTeammates(searchValue.value);
        }, 0);

        //TO DO
        const onToggleResendEmail = async (record: Teammate) => {
            if (record.is_deleted !== undefined && record.is_deleted) {
                isShowModalErrorDeletedRecord.value = true;
                errorDeletedRecordType.value = 'resend_deleted';
            } else {
                try {
                    const data = await resendEmailTeammate(record.id);
                    if (data) {
                        addToast({
                            single: true,
                            title: t('setting.teammate_toast_invite_success'),
                            type: 'basic',
                            timeout: 3000,
                        });
                        if (teammatesByKeyword.value.length > 0) {
                            const index = teammatesByKeyword.value?.findIndex((item: any) => item.id === record.id);
                            if (index >= 0) teammatesByKeyword.value[index].status = STATUS_USER.INACTIVED_EMAIL;
                        }
                        if (teammates.value !== null) {
                            const index = teammates.value?.findIndex((item: any) => item.id === record.id);
                            // console.log({ index });
                            if (index >= 0) teammates.value[index].status = STATUS_USER.INACTIVED_EMAIL;
                        }
                        teammatesByKeyword.value = teammatesByKeyword.value.filter(
                            (item: any) => item.id !== selectedDeleteRecord.value?.id,
                        );
                    }
                } catch (e) {
                    if (e.token_has_not_expired_yet !== undefined) isShowModalExpireResendInvite.value = true;
                }
            }
        };

        const onToggleEditEmail = (record: Teammate) => {
            if (record.is_deleted !== undefined && record.is_deleted) {
                isShowModalErrorDeletedRecord.value = true;
                errorDeletedRecordType.value = 'edit';
            } else {
                isShowEditEmail.value = true;
                selectedEditEmailRecord.value = record;
            }
        };

        const onToggleDeleteRecord = (record: Teammate) => {
            isShowHandover.value = true;
            selectedDeleteRecord.value = record;
        };

        const onChangeRole = async ({ record, role_id }: any) => {
            if (record.role_id !== role_id) {
                await updateUserByID(record.id, { role_ids: [role_id] });
                const index = teammatesByKeyword.value.findIndex((item: User) => item.id === record.id);
                teammatesByKeyword.value[index].role_id = role_id;
            }
        };

        const onDeleteSuccess = (target = null) => {
            if (target) {
                selectedDeleteRecord.value = target;
            }
            // teammatesByKeyword.value = teammatesByKeyword.value.filter(
            //     (item: any) => item.id !== selectedDeleteRecord.value?.id,
            // );
            // if (teammates.value !== null) {
            //     teammates.value = teammates.value?.filter((item: any) => item.id !== selectedDeleteRecord.value?.id);
            // }
        };

        const onDeleteSuccessFromModalHandover = () => {
            const findIndex = usersActive.value.findIndex((user: any) => user.id === selectedDeleteRecord.value?.id);
            if (typeof findIndex !== 'undefined') {
                usersActive.value.splice(findIndex, 1);
            }
        };

        const onShowModalDeletedRecord = (type: any) => {
            isShowModalErrorDeletedRecord.value = true;
            errorDeletedRecordType.value = type;
        };

        const onDeleteInvitation = async (record: any) => {
            if (userStore.value._id !== record.id) {
                try {
                    await deleteUserByID(record.id, {});
                    onDeleteSuccess(record);
                    const indexTeammatesByKeyword = teammatesByKeyword.value.findIndex(
                        (item: any) => item.id === record.id,
                    );
                    if (indexTeammatesByKeyword !== -1) {
                        teammatesByKeyword.value.splice(indexTeammatesByKeyword, 1);
                        total.value--;
                    }
                    // if (index >= 0) teammatesByKeyword.value[index].is_deleted = true;
                    if (teammates.value !== null) {
                        const indexTeammates = teammates.value.findIndex((item: any) => item.id === record.id);
                        if (indexTeammates !== -1) {
                            teammates.value.splice(indexTeammates, 1);
                        }
                        // if (index >= 0) teammatesByKeyword.value[index].is_deleted = true;
                    }
                    addToast({
                        single: true,
                        title: t('setting.teammate_toast_deleted_success'),
                        type: 'basic',
                        timeout: 3000,
                    });
                } catch (e) {
                    if (e.transfer_to !== undefined) {
                        isShowHandover.value = true;
                        selectedDeleteRecord.value = record;
                    }
                }
            }
        };

        const onScrollToBottom = async () => {
            if (isLoadMore.value) return;
            if (next_page.value != null && next_page.value != 'null' && next_page.value !== '') {
                isLoadMore.value = true;
                await onSearchTeammates(searchValue.value);
                isLoadMore.value = false;
            }
        };

        const onEditEmail = (teammate: any) => {
            const findIndex = teammatesByKeyword.value.findIndex((item: any) => item.id === teammate._id);
            if (findIndex !== -1) {
                teammatesByKeyword.value[findIndex].email = teammate.email;
                if (
                    teammatesByKeyword.value[findIndex].status !== STATUS_USER.INACTIVED_EMAIL &&
                    teammate.status === STATUS_USER.INACTIVED
                ) {
                    teammatesByKeyword.value[findIndex].status = STATUS_USER.INACTIVED_EMAIL;
                }
            }
        };

        const checkExpiredInvitation = () => {
            for (let index = 0; index < teammatesByKeyword.value.length; index++) {
                const teammate = teammatesByKeyword.value[index];
                if (
                    new Date(teammate.send_at).getTime() + LIFE_TIME_SIGN_URL <= Date.now() &&
                    teammate.status === STATUS_USER.INACTIVED_EMAIL
                ) {
                    teammate.status = STATUS_USER.EXPIRED_EMAIL;
                    console.log(teammate.email, '-------------------- expired invite ------------------');
                }
            }
        };

        onMounted(async () => {
            await getRole();
            await onGetInviteTeammateList();
            await onSearchTeammates(searchValue.value);
            changeStatusUser();
            intervalTime.value = setInterval(() => {
                checkExpiredInvitation();
            }, 30000);
            socket.off('incomingContactOnlineStatus').on('incomingContactOnlineStatus', async (data: any) => {
                if (teammatesByKeyword.value) {
                    const index = teammatesByKeyword.value.findIndex((item: any) => item.id === data.id);
                    if (index >= 0) teammatesByKeyword.value[index].online_status = data.online_status;
                }
            });
            socket.off('user.update.complete').on('user.update.complete', async (data: any) => {
                console.log('user.update.complete', data);
                const findIndex = teammatesByKeyword.value.findIndex((item: any) => item.id === data.data._id);
                if (findIndex !== -1) {
                    teammatesByKeyword.value[findIndex].email = data.data.email;
                    teammatesByKeyword.value[findIndex].username = data.data.username;
                    teammatesByKeyword.value[findIndex].full_name = data.data.full_name;
                    if (data.data.token_status && data.data.token_status === 1) {
                        teammatesByKeyword.value[findIndex].status = STATUS_USER.INACTIVED_EMAIL;
                        teammatesByKeyword.value[findIndex].send_at = new Date().toISOString();
                    }
                    if (data.data.status === 1) {
                        teammatesByKeyword.value[findIndex].status = STATUS_USER.ACTIVATED;
                    }
                }
            });
            socket.off('user.delete.complete').on('user.delete.complete', async (data: any) => {
                console.log('user.delete.complete', data);
                const indexTeammatesByKeyword = teammatesByKeyword.value.findIndex(
                    (item: any) => item.id === data.data.user_id,
                );
                if (indexTeammatesByKeyword !== -1) {
                    teammatesByKeyword.value.splice(indexTeammatesByKeyword, 1);
                    total.value--;
                }
                if (teammates.value !== null) {
                    const indexTeammates = teammates.value.findIndex((item: any) => item.id === data.data.user_id);
                    if (indexTeammates !== -1) {
                        teammates.value.splice(indexTeammates, 1);
                    }
                }
            });
            addActionRoleChange((data: any) => {
                const findIndex = teammatesByKeyword.value.findIndex((item: any) => item.id === data.user_id);
                if (findIndex !== -1) {
                    teammatesByKeyword.value[findIndex].role_id = data.role_change[0];
                }
            });
            // socket.off('incomingRoleChange').on('incomingRoleChange', async (data: any) => {
            //     const findIndex = teammatesByKeyword.value.findIndex((item: any) => item.id === data.user_id);
            //     if (findIndex !== -1) {
            //         teammatesByKeyword.value[findIndex].role_id = data.role_change[0];
            //     }
            // });
            socket.off('incomingUserOnlineStatus').on('incomingUserOnlineStatus', (data: any) => {
                console.log('incomingUserOnlineStatus', data);
                if (data) {
                    const getAssignUser = teammatesByKeyword.value.filter((item: any) => item.id === data._id);
                    if (getAssignUser.length > 0) {
                        const objIndex = teammatesByKeyword.value.findIndex((obj: any) => obj.id == data._id);
                        if ((teammatesByKeyword as any).value[objIndex]) {
                            (teammatesByKeyword as any).value[objIndex].online_status = data.online_status;
                        }
                        return teammatesByKeyword.value;
                    }
                }
            });
        });

        onUnmounted(() => {
            clearInterval(intervalTime.value);
            // socket.off('incomingContactOnlineStatus');
            // socket.off('user.update.complete');
            // socket.off('user.delete.complete');
            // socket.off('incomingRoleChange');
            // socket.off('incomingUserOnlineStatus');
        });

        watch(
            searchValue,
            debounce((newVal) => {
                if (newVal) {
                    // console.log(isSearchByEnter.value);
                    if (!isSearchByEnter.value) {
                        refreshData();
                        onSearchTeammates(newVal);
                    } else {
                        isSearchByEnter.value = false;
                    }
                } else {
                    // teammatesByKeyword.value = teammates.value;
                    refreshData();
                    onSearchTeammates(newVal);
                    status.value = 'search';
                }
            }, 2000),
        );

        return {
            loading,
            columns,
            teammates,
            teammatesByKeyword,
            searchValue,
            onEnterSearch,
            status,
            searchedValue,
            next_page,
            total,
            isLoadMore,
            isShowEditEmail,
            selectedEditEmailRecord,
            onToggleEditEmail,
            isShowHandover,
            selectedDeleteRecord,
            onToggleDeleteRecord,
            envURL,
            isSearchByEnter,
            STATUS_USER,
            roles,
            getRoleOfTeammate,
            onChangeRole,
            isShowModalInviteTeammate,
            isShowModalExpireResendInvite,
            onDeleteSuccess,
            onToggleResendEmail,
            inviteTeammateList,
            isShowModalEditActivedEmail,
            onDeleteInvitation,
            userStore,
            isShowModalErrorDeletedRecord,
            errorDeletedRecordType,
            changeStatusUser,
            onShowModalDeletedRecord,
            onScrollToBottom,
            userListCustom,
            onDeleteSuccessFromModalHandover,
            onEditEmail,
        };
    },
};
</script>

<style lang="scss">
.setting-teammate {
    height: 100%;
    &__no-data {
        top: calc(30% - 114px);
        width: -webkit-fill-available;
    }
    &__data {
        &-table {
            max-height: calc(100vh - 250px);
            overflow: auto;
            // overflow: auto;
        }
    }
}
</style>
