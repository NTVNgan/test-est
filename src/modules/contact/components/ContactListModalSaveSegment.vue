<template>
    <modal-component v-model="showModalSync" :custom-class="'py-32p'" :width="'464px'" class="model-add-contact z-999">
        <template v-slot:header>
            <div class="flex">
                <icon-component class="mr-3p" name="InfoCircle" color="primary-500" />
                <span class="font-medium text-16">Save segment</span>
            </div>
        </template>
        <template v-slot:body>
            <div class="px-32p radio-save-segment">
                <Radio
                    v-for="(item, i) in optionRadio"
                    :key="i"
                    :valueRadio="item.value"
                    v-model="picked"
                    nameRadio="groupRadio"
                    @change="onChange"
                >
                    <template v-slot:label>{{ item.label }}</template>
                </Radio>
                <template v-if="checkCreateSegment">
                    <form v-if="countSegmentLimit" class="ml-24p">
                        <Input
                            class="mt-3p"
                            :state="segmentName && invalidSegmentName ? 'error' : 'primary'"
                            v-model.trim="segmentName"
                            type="text"
                            :maxlength="30"
                            :counter="true"
                            :placeholder="'Enter segment name'"
                        >
                        </Input>
                        <span v-if="segmentName && invalidSegmentName" class="text-error-3 text-14 mt-4p">
                            Segment name already exists. Please try another one.
                        </span>
                    </form>
                    <Alert v-else :type="'warning'" class="ml-24p mt-3p" :close="false">
                        <template v-slot:message>
                            <p class="mt-3p">You have reached the limit of 200 segments</p>
                        </template>
                    </Alert>
                </template>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <Button class="mr-8p" type="outline" size="medium" @click="closeModal">
                    {{ $t('contact.contact_list_modal_btn_cancel') }}
                </Button>
                <Button size="medium" @click="onSubmit" :disabled="onDisabledSubmit">
                    {{ $t('contact.contact_list_modal_btn_add') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, reactive } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useSegment } from '@/modules/contact/composables/useSegment';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { routerPush } from '@/router';
import IconComponent from '@/components/ui/IconComponent.vue';
import Radio from '@/components/ui/RadioButtonComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';

export default defineComponent({
    name: 'ContactListModalSaveSegment',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        currSegment: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {
                name: '',
                id: '',
            },
        },
        arrAttributeHide: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        Button,
        Input,
        ModalComponent,
        IconComponent,
        Radio,
        Alert,
    },
    setup(props, { emit }) {
        const segmentName = ref<string>(('Copy of ' + props.currSegment.name).slice(0, 30));
        const errorMessageSegmentName = ref<string>('');
        const {
            updateSegment,
            createSegment,
            getCountSegmentCustom,
            updateSegmentCustomList,
            countSegmentCustom,
        } = useSegment();
        const { addToast } = useToast();
        const { t } = useI18n();
        const emitter: any = inject('emitter');
        const optionRadio = reactive([
            { label: 'Save this segment', value: 'save_this_segment' },
            { label: 'Save as new segment', value: 'save_new_segment' },
        ]);
        const picked = ref('save_this_segment');

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const checkCreateSegment = computed(() => {
            return picked.value === 'save_new_segment';
        });

        const countSegmentLimit = computed(() => {
            return countSegmentCustom.value < 200;
        });

        const invalidSegmentName = computed(() => {
            if (segmentName.value !== '' && errorMessageSegmentName.value === 'name_is_unique') {
                return true;
            }
            if (!segmentName.value) {
                return false;
            }
            return false;
        });
        const onDisabledSubmit = computed(() => {
            if (!countSegmentLimit.value && picked.value === 'save_new_segment') return true;
            if (segmentName.value === '') {
                return true;
            }
            if (segmentName.value !== '') {
                if (segmentName.value && invalidSegmentName.value) {
                    return true;
                }
            }
            return false;
        });

        const closeModal = async () => {
            emit('close');
            picked.value = 'save_this_segment';
        };

        const onChange = async (data: any) => {
            console.log('change', data);
        };

        const newSegment = async () => {
            const newSegment: any = {
                name: segmentName.value.slice(0, 30),
                slug: segmentName.value,
                description: '',
                group: 3,
                conditions: props.currSegment.conditions,
            };
            if (
                newSegment.conditions != null &&
                typeof newSegment.conditions.groups != 'undefined' &&
                newSegment.conditions.groups.length > 0
            )
                newSegment.conditions.groups.forEach((m: any) => {
                    delete m._id;
                });
            const res = await createSegment(newSegment);
            if (res.error) {
                errorMessageSegmentName.value = '';
                for (let index = 0; index < Object.keys(res.message).length; index++) {
                    const errorKey = Object.keys(res.message)[index];
                    if (errorKey === 'name_is_unique') {
                        errorMessageSegmentName.value = 'name_is_unique';
                    }
                }
            } else {
                closeModal();
                addToast({
                    title: 'Saved as new segment successfully',
                    type: 'basic',
                    timeout: 3000,
                });
                const newSegment = res.data[0];
                await updateSegmentCustomList(newSegment);
                await new Promise(resolve => setTimeout(resolve, 200));
                routerPush('ContactListBySegment', { segmentId: newSegment._id });
                emit('submitSegment');
            }
        };

        const updateCurrentSegment = async () => {
            const res = await updateSegment(props.currSegment, props.currSegment._id);
            if (!res.error) {
                addToast({
                    title: 'Saved segment successfully',
                    type: 'basic',
                    timeout: 3000,
                });
                emit('submitSegment');
                await closeModal();
            }
        };

        const getCountSegment = async () => {
            await getCountSegmentCustom();
        };

        const onSubmit = async () => {
            if (props.arrAttributeHide.length > 0) {
                console.log('11');
                const listFilter = props.currSegment.conditions.groups[0].conditions;
                const convertList = listFilter.map((item: any) => {
                    const convertItem = Object.keys(item)[0];
                    return convertItem.replace('attr_', '').split(':')[0];
                });
                const findSegment = convertList.some((item: any) => props.arrAttributeHide.includes(item));
                if (findSegment) {
                    // showModalHiddenAttribute.value = true;
                    closeModal();
                    emit('showModalHiddenAttribute');
                }
            } else {
                console.log('11 else');
                if (picked.value === 'save_new_segment') await newSegment();
                else await updateCurrentSegment();
            }
        };

        watch(
            () => segmentName.value,
            () => {
                if (errorMessageSegmentName.value) {
                    errorMessageSegmentName.value = '';
                }
            },
            { deep: true },
        );
        watch(
            () => props.showModal,
            () => {
                if (props.showModal) {
                    getCountSegment();
                }
                picked.value = 'save_this_segment';
                segmentName.value = ('Copy of ' + props.currSegment.name).slice(0, 30);
            },
            { deep: true },
        );

        return {
            segmentName,
            invalidSegmentName,
            onDisabledSubmit,
            showModalSync,
            errorMessageSegmentName,
            closeModal,
            onSubmit,
            optionRadio,
            picked,
            onChange,
            checkCreateSegment,
            countSegmentLimit,
        };
    },
});
</script>

<style lang="scss" scoped>
.radio-save-segment :deep(.radio-component:first-child) {
    margin-bottom: 24px;
}
</style>
