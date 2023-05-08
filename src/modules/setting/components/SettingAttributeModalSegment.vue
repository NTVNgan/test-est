<template>
    <div>
        <modal-component v-model="showModalSync" :custom-class="'py-24p'" :width="'560px'" class="model-add-contact z-999">
            <template v-slot:header>
                <div class="flex">
                    <icon-component
                        name="exclamation-circle"
                        class="icon-recently cursor-pointer"
                        color="error-3"
                    />
                    <span class="font-medium text-16 ml-4p">Hide {{isMoreTextAttributeNumber}}?</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="px-60p py-8p">
                    <p class="text-14">Hide {{attribute.length > 0 ? attribute.length > 1 ? ` attributes` : ` this attribute` : ` attributes`}} will affect all segments that contain them, <br>please check again to make sure your action.</p>
                    <div class="list-segment mt-24p mb-16p scrollbar--transparent overflow-y-auto h-184 relative" v-if="segment.length > 0">
                        <span class="block mb-8p" v-for="(item, i) in segment" :key="i">
                            <router-link
                                :to="{
                                    name: 'ContactListBySegment',
                                    params: { segmentId: item._id },
                                    query: { showFilter: true },
                                }"
                            >
                                <Button size="small" type="secondary">
                                    <span class="font-normal text-12 capitalize">{{ item.name }}</span>
                                </Button>
                            </router-link>
                        </span>
                        <div v-if="isLoading" class="absolute w-full pt-8p flex justify-center items-center">
                            <Spinner size="normal" class="w-24 h-24" />
                        </div>
                    </div>
                    <router-link :to="{ name: 'ContactSegment'}" target="_blank" class="flex items-center">
                        <span class="text-14 text-primary-500">Check segments
                        </span>
                        <icon-component
                            name="ExternalLink"
                            class="icon-recently cursor-pointer"
                            color="primary-500"
                        />
                    </router-link>
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button class="mr-8p" type="outline" size="medium" @click="closeModal"> 
                        {{ $t('setting.teammate_modal_edit_email_button_cancel') }}
                    </Button>
                    <Button size="medium" type="destructive" @click="hideAttribute">
                        Hide
                    </Button>
                </div>
            </template>
        </modal-component>
        <modal-component v-model="showModalSuccess" :closeIcon="false" :custom-class="'py-24p'" :width="'496px'" class="model-add-contact z-999">
            <template v-slot:body>
                <div class="px-24p pt-8p text-center text-14">
                    <p class="text-24 font-semibold capitalize font-heading">
                        {{isMoreTextAttribute}} successfully hidden</p>
                    <p class="text-14 my-16p">We will reload this page for the newest data.</p>
                    <Button size="medium" @click="closeModalSuccess">
                        Got it
                    </Button>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted, onUpdated } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useAttribute } from '@/modules/setting/composables/useContactAttribute';
import Spinner from '@/components/ui/Spinner.vue';
import debounce from 'lodash/debounce';

export default defineComponent({
    name: 'SettingAttributeSegment',
    components: {
        ModalComponent,
        Button,
        IconComponent,
        Spinner
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        segment: {
            type: Array,
            default: () => [],
        },
        attribute: {
            type: Array,
            default: () => [],
        },
        // allAttributeShow: {
        //     type: Array,
        //     default: () => [],
        // },
        allAttributeShow: {
            type: Number,
            default: 0
        },
        next_page: {
            type: String,
            default: ''
        },
        keyword: {
            type: String,
            default: null
        },
        auid: {
            type: String,
            default: null
        },
        updated_to:{
            type: String,
            default: null
        },
        updated_from:{
            type: String,
            default: null
        },
    },
    setup(props, { emit }) {
        const showModalSuccess = ref<boolean>(false);
        const { error, errorMessage, loading, changeAttribute, getSegmentByIdAttribute } = useAttribute();
        const isLoading = ref<boolean>(false);

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const closeModal = async () => {
            emit('close');
        };

        const hideAttribute = async () => {
            const res = await changeAttribute({ids: props.attribute, show: false, keyword: props.keyword, _auid: props.auid, updated_at_from: props.updated_from, updated_at_to: props.updated_to });
            if (!error.value) {
                closeModal();
                showModalSuccess.value = true;
            } 
        };

        const closeModalSuccess = () => {
            location.reload();
        };

        const isMoreTextAttributeNumber = computed(() => {
            if (props.attribute.length > 0){
                if (props.attribute.length > 1){
                    return props.attribute.length+` attributes`
                } else return `attribute`
            } else {
                if (props.allAttributeShow > 1){
                    return props.allAttributeShow + ` attributes`
                } else return props.allAttributeShow + ` attribute`
            }
            // return props.attribute.length > 0 ? props.attribute.length > 1 ? props.attribute.length+` attributes` : props.attribute.length+` attribute` : props.allAttributeShow + ` attributes`
        });

        const isMoreTextAttribute = computed(() => {
            if (props.attribute.length > 0){
                if (props.attribute.length > 1){
                    return props.attribute.length+` attributes`
                } else return `attribute`
            } else {
                if (props.allAttributeShow > 1){
                    return props.allAttributeShow + ` attributes`
                } else return `attribute`
            }
        }) 

        const loadmoreSegment = async () => {
            const res = await getSegmentByIdAttribute({attribute: props.attribute, next_page: props.next_page, show: true});
            if (res){
                isLoading.value = false;
                emit('updateListSegment', res);
            }
        };

        const updateListSegment = () => {
            const parentEl:any = document.getElementsByClassName("list-segment");
            if (props.showModal){
                console.log('props.next_page', props.next_page);
            }
            if (parentEl.length > 0){
                parentEl[0].addEventListener('scroll', (event: any) => {
                    if ((parentEl[0].scrollTop === (parentEl[0].scrollHeight - parentEl[0].offsetHeight)) && isLoading.value === false && props.next_page){
                        isLoading.value = true;
                        console.log('111');
                        loadmoreSegment();
                    }
                })
            }
        }

        // onMounted(() => {
        //     updateListSegment();
        // })

        onUpdated(() => {
            updateListSegment();
        });

        return {
            showModalSync,
            closeModal,
            showModalSuccess,
            hideAttribute,
            closeModalSuccess,
            isMoreTextAttributeNumber,
            isMoreTextAttribute,
            isLoading,
            loadmoreSegment,
        }
    }
})
</script>