<template>
    <div class="py-24p px-40p profile-notification h-full overflow-y-auto scrollbar--transparent relative">
        <h2 class="text-24 font-semibold font-heading">Notifications</h2>
        <div class="profile-notification__form">
            <div class="profile-notification__form-item mb-24p">
                <span class="text-16 font-bold">Activity</span>
                <div class="p-16p setting-list">
                    <ul>
                        <li class="flex items-center justify-between border-b border-neutrals-100 pb-16p mb-16p">
                            <span class="text-14 text-neutrals-600">Activity in all conversations</span>
                            <toggle-comp v-model="settingNoti.activity_all_conversation" size="medium"></toggle-comp>
                        </li>
                        <li class="flex items-center justify-between border-b border-neutrals-100 pb-16p mb-16p">
                            <span class="text-14 text-neutrals-600">Activity in conversation assigned to you</span>
                            <toggle-comp v-model="settingNoti.activity_assigned_conversation" size="medium"></toggle-comp>
                        </li>
                        <li class="flex items-center justify-between">
                            <span class="text-14 text-neutrals-600">Activity in all unassigned conversations</span>
                            <toggle-comp v-model="settingNoti.activity_unassigned_conversation" size="medium"></toggle-comp>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="profile-notification__form-item mb-24p">
                <span class="text-16 font-bold">Mention</span>
                <div class="p-16p setting-list">
                    <ul>
                        <li class="flex items-center justify-between">
                            <span class="text-14 text-neutrals-600">Any mentions of you in a conversation</span>
                            <toggle-comp v-model="settingNoti.mention_in_conversation" size="medium"></toggle-comp>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="profile-notification__form-item mb-24p">
                <span class="text-16 font-bold">Data</span>
                <div class="p-16p setting-list">
                    <ul>
                        <li class="flex items-center justify-between border-b border-neutrals-100 pb-16p mb-16p">
                            <span class="text-14 text-neutrals-600">Import contact data</span>
                            <toggle-comp v-model="settingNoti.import_contact" size="medium"></toggle-comp>
                        </li>
                        <li class="flex items-center justify-between border-b border-neutrals-100 pb-16p mb-16p">
                            <span class="text-14 text-neutrals-600">Archive contact</span>
                            <toggle-comp v-model="settingNoti.archive_contact" size="medium"></toggle-comp>
                        </li>
                        <li class="flex items-center justify-between">
                            <span class="text-14 text-neutrals-600">Delete activated teammate</span>
                            <toggle-comp v-model="settingNoti.delete_actived_teammate" size="medium"></toggle-comp>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="profile-notification__form-item mb-24p">
                <span class="text-16 font-bold">Alert</span>
                <div class="p-16p setting-list">
                    <ul>
                        <li class="flex items-center justify-between pb-16p">
                            <div class="flex items-center">
                                <span class="text-14 text-neutrals-600 mr-8p">Sound</span>
                                <Tooltip
                                    size="small"
                                    position="top"
                                    content="Click to play sound"
                                >
                                    <button-component size="small" type="outline" icon="volume-up" colorIcon="neutrals-600" @click="playSound" />
                                </Tooltip>
                            </div>
                            <toggle-comp v-model="settingNoti.alert_sound" size="medium"></toggle-comp>
                        </li>
                    </ul>
                </div>
            </div>
            <button-group class="profile-account__form-button mt-24p justify-end px-16p">
                <button-component
                    class="px-18p"
                    :class="{'btn-cancel': !disableButtonCancel}"
                    size="small"
                    type="secondary"
                    :disabled="disableButtonCancel"
                    @click="resetDefault"
                >
                    <span class="text-neutrals-300">Cancel</span>
                </button-component>
                <button-component
                    class="ml-4p px-18p"
                    size="small"
                    type="primary"
                    :disabled="disableButtonSave"
                    @click="saveNotification"
                >
                    <span>Apply</span>
                </button-component>
            </button-group>
        </div>
        <audio id="myAudio">
            <source src="@/assets/sound/notification/intuition-561.ogg" type="audio/ogg">
            <source src="@/assets/sound/notification/intuition-561.mp3" type="audio/mpeg">
        </audio>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import ToggleComp from '@/components/ui/ToggleComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ButtonGroup from '@/components/ui/ButtonGroupComponent.vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import { useUser } from '@/modules/auth/composables/useUser';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { store } from '@/store';
import IconComponent from '@/components/ui/IconComponent.vue';

interface SetttingNoti {
    activity_all_conversation: boolean;
    activity_assigned_conversation: boolean;
    activity_unassigned_conversation: boolean;
    import_contact: boolean;
    archive_contact: boolean;
    delete_actived_teammate: boolean;
    alert_sound: boolean;
    mention_in_conversation: boolean;
}

export default defineComponent({
    name: 'ProfileNotification',
    components: {
        ToggleComp,
        ButtonComponent,
        ButtonGroup,
        Tooltip,
        // IconComponent
    },
    setup() {
        const { updateUser } = useUser();
        const disableButtonSave = ref<boolean>(true),
        disableButtonCancel = ref<boolean>(true);
        const settingNoti = ref<SetttingNoti>({
            activity_all_conversation: true,
            activity_assigned_conversation: false,
            activity_unassigned_conversation: false,
            import_contact: true,
            archive_contact: true,
            delete_actived_teammate: true,
            alert_sound: true, 
            mention_in_conversation: true
        });
        const { addToast } = useToast();
        const { t } = useI18n();
        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const settingNotiClone = ref<SetttingNoti>(JSON.parse(JSON.stringify(settingNoti.value)));

        const playSound = () => {
            const audio:any = document.getElementById("myAudio");
            audio.play();
        };

        const resetDefault = () => {
            settingNoti.value = JSON.parse(JSON.stringify(settingNotiClone.value));
        };

        const saveNotification = async () => {
            try {
                const resNoti: User = await updateUser({
                    notification_setting: settingNoti.value
                });
                if (resNoti){
                    userStore.value.notification_setting = JSON.parse(JSON.stringify(settingNoti.value));
                    settingNotiClone.value = JSON.parse(JSON.stringify(settingNoti.value));
                    disableButtonCancel.value = true;
                    disableButtonSave.value = true;
                    addToast({
                        title: t('Setting changed successfully'),
                        type: 'basic',
                        single: true,
                        timeout: 3000,
                    });
                }
            } catch (e) {
                console.log({ e });
            }
        };

        onMounted(async () => {
            const userData = userStore;
            if (userData) {
                const settingNotiUser = userData && userData.value.notification_setting;
                settingNoti.value = { ...settingNotiUser };
                settingNotiClone.value = (JSON.parse(JSON.stringify(settingNoti.value)));
            }
        });

        watch(settingNoti, (val) => {
            disableButtonSave.value = !(JSON.stringify(settingNoti.value) !== JSON.stringify(settingNotiClone.value));
            disableButtonCancel.value = !(JSON.stringify(settingNoti.value) !== JSON.stringify(settingNotiClone.value));
        },{ deep: true })

        return {
            disableButtonSave,
            disableButtonCancel,
            playSound,
            settingNoti,
            settingNotiClone,
            resetDefault,
            saveNotification,
            userStore
        };
    },
});
</script>

<style lang="scss" scoped>
.profile-notification{
    &__form{
        max-width: 600px;
        width: 100%;
        margin: 32px auto 0;
    }
    :deep(button){
        :deep(.icon-comp[data-svg='outline']) {
            :deep(svg) {
                fill: #555562;
            }
        }
    }
}
</style>
