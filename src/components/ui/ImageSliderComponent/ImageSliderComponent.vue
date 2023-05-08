<template>
    <transition enter-active-class="duration-300" leave-active-class="duration-200">
        <div id="linebaseImageGallery" ref="linebaseImageGallery" class="fixed inset-x-0 text-neutrals-900 z-50">
            <transition
                enter-active-class="ease-out opacity-0"
                enter-to-class="opacity-100"
                leave-active-class=" ease-in"
                leave-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    @click="confirm ? onCloseModal : () => true"
                    v-show="visible"
                    class="fixed inset-0 transition-opacity"
                >
                    <div
                        class="absolute inset-0 bg-neutrals-900 bg-opacity-90 backdrop-filter transition-all"
                        style="backdrop-filter: blur(5px)"
                    ></div>
                </div>
            </transition>

            <transition
                enter-active-class="duration-300 ease-out translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
                enter-to-class="translate-y-0 opacity-100 sm:scale-100"
                leave-active-class="duration-200 ease-in"
                leave-class="translate-y-0 opacity-100 sm:scale-100"
                leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            >
                <div v-show="visible" class="fixed inset-0 transition-opacity">
                    <div class="absolute w-screen h-screen px-24p pt-8p pb-16p text-neutrals-100 flex flex-col">
                        <div class="flex justify-between items-center mb-8p">
                            <div class="flex items-center text-14">
                                <icon-component name="InfoCircleWhite" class="mr-4p" color="white"></icon-component>
                                <span> {{ imageDate }} </span>
                                <!-- Yesterday 09:02 AM -->
                            </div>
                            <!-- <span class="absolute right-1/2 transform translate-x-1/2 text-16"> 5/11 </span> -->
                            <div
                                class="
                                    w-40
                                    h-40
                                    flex
                                    items-center
                                    justify-center
                                    bg-neutrals-900 bg-opacity-80
                                    cursor-pointer
                                    rounded-4p
                                "
                                tabindex="1"
                                :class="btnCssAttr"
                                @click="onCloseModal"
                            >
                                <icon-component name="times" color="white"></icon-component>
                            </div>
                            <!-- <button-component
                                class="bg-neutrals-900 bg-opacity-40"
                                icon="times"
                                size="large"
                                type="secondary"
                            >
                            </button-component> -->
                        </div>
                        <div class="image-slider__image flex-grow max-h-full relative flex justify-center">
                            <template v-if="positionImage !== -2">
                                <div
                                    class="
                                        image-slider__navigate
                                        absolute
                                        rounded-full
                                        w-66
                                        h-66
                                        z-40
                                        cursor-pointer
                                        bg-neutrals-900 bg-opacity-80
                                        left-0
                                        shadow-2p
                                        top-1/2
                                    "
                                    tabindex="1"
                                    :class="[...btnCssAttr]"
                                    @click="onMoveImage(-1)"
                                    @mouseover="isMouseOverButton = true"
                                    @mouseleave="isMouseOverButton = false"
                                    v-if="(!isMouseStopped || isMouseOverButton) && positionImage !== -1"
                                >
                                    <!-- 'opacity-40 cursor-not-allowed pointer-events-none' -->
                                    <icon-component
                                        class="flex justify-center items-center h-full"
                                        name="chevron-left-regular"
                                        :color="'white'"
                                    />
                                </div>
                                <div
                                    class="
                                        image-slider__navigate
                                        absolute
                                        rounded-full
                                        w-66
                                        h-66
                                        z-40
                                        cursor-pointer
                                        bg-neutrals-900 bg-opacity-40
                                        right-0
                                        shadow-2p
                                        top-1/2
                                    "
                                    tabindex="1"
                                    :class="[...btnCssAttr]"
                                    @click="onMoveImage(1)"
                                    @mouseover="isMouseOverButton = true"
                                    @mouseleave="isMouseOverButton = false"
                                    v-if="(!isMouseStopped || isMouseOverButton) && positionImage !== 1"
                                >
                                    <icon-component
                                        class="flex justify-center items-center h-full"
                                        name="chevron-right-regular"
                                        color="white"
                                    />
                                </div>
                            </template>
                            <div class="image-slider__image flex justify-center max-h-full px-24p">
                                <img
                                    v-if="activeImage && activeImage.url"
                                    class="select-none object-contain"
                                    :src="envImageURL + '/' + activeImage.url"
                                    :alt="activeImage.name"
                                    srcset=""
                                />
                            </div>
                        </div>
                        <div class="image-slider__list h-64 flex justify-center pt-56p flex-col items-center">
                            <div class="flex mb-20p min-h-24">
                                <template v-for="(item, index) in tags" :key="index">
                                    <TooltipComponent
                                        :content="item.name"
                                        position="top"
                                        type="light"
                                        class="ml-4p"
                                        v-if="index <= 2"
                                        :disabled="nameTagHover !== `tagname-${item._id}`"
                                    >
                                        <tag-component :isClose="false" :value="item" icon="tag-solid10" disabled>
                                            <span
                                                :id="`tagname-${item._id}`"
                                                class="truncate block text-neutrals-900"
                                                @mouseover="isEllipsisActive(`tagname-${item._id}`)"
                                                >{{ item.name }}</span
                                            >
                                        </tag-component>
                                    </TooltipComponent>
                                </template>
                                <new-dropdown-component
                                    width="352px"
                                    v-model="showDropdownTag"
                                    position="top-right"
                                    v-if="tags && tags.length > 3"
                                    contentClass="backdrop-filter-blur bg-neutrals-900 bg-opacity-30"
                                    blured
                                >
                                    <button
                                        class="
                                            flex
                                            outline-none
                                            items-center
                                            focus:outline-none
                                            tag-icon
                                            py-2p
                                            px-8p
                                            h-24
                                            border
                                            rounded
                                            border-neutrals-300
                                            max-w-196
                                            truncate
                                            ml-4p
                                            text-white text-12
                                            bg-neutrals-500
                                        "
                                    >
                                        + {{ tags.length - 3 }} more tags
                                    </button>
                                    <template #content>
                                        <div></div>
                                        <div class="flex flex-col p-6p mb-4p">
                                            <div class="flex justify-end mb-4p">
                                                <icon-component
                                                    class="cursor-pointer"
                                                    name="times"
                                                    color="white"
                                                    @click="showDropdownTag = false"
                                                />
                                            </div>
                                            <div class="flex flex-wrap p-10p">
                                                <template v-for="(item, index) in tags">
                                                    <tag-component
                                                        :isClose="false"
                                                        classCustom="max-w-320 mr-4p mb-4p "
                                                        :value="item"
                                                        icon="tag-solid-10"
                                                        disabled
                                                        :key="index"
                                                        v-if="index > 2"
                                                        :truncate="false"
                                                    >
                                                        <span
                                                            :id="`tagname-${item.id}`"
                                                            class="block text-neutrals-900 text-left"
                                                            @mouseover="isEllipsisActive(`tagname-${item.id}`)"
                                                            >{{ item.name }}</span
                                                        >
                                                    </tag-component>
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                </new-dropdown-component>
                            </div>
                            <div class="flex">
                                <div
                                    class="
                                        image-slider__list-item
                                        rounded-4p
                                        h-64
                                        w-64
                                        overflow-hidden
                                        mx-6p
                                        cursor-pointer
                                    "
                                    :class="{
                                        'image-slider__list-item--unactive':
                                            activeImage && item._id !== activeImage._id,
                                    }"
                                    v-for="item in imageList"
                                    :key="item.url"
                                    @click="onSelectImage(item)"
                                >
                                    <img
                                        class="select-none object-cover w-full h-full"
                                        :src="envImageURL + '/' + item.url"
                                        alt=""
                                        srcset=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import TagComponent from '@/components/ui/TagComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { services } from '@/modules/inbox/services';
import { AxiosResponse } from 'axios';
import filters from '@/utils/filters';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import { useTag } from '@/modules/setting/composables/useTag';
import debounce from 'lodash/debounce';

type imageItem = {
    _id: string;
    url?: string;
    name?: string;
};

export default defineComponent({
    name: 'ImageSiderComponent',
    components: {
        IconComponent,
        TagComponent,
        TooltipComponent,
        NewDropdownComponent,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        width: {
            type: [String, Number],
            default: '560px',
        },
        customClass: {
            type: String,
            default: 'py-40p',
        },
        closeIcon: {
            type: Boolean,
            default: true,
        },
        confirm: {
            type: Boolean,
            default: false,
        },
        activeImageId: {
            type: String,
            default: '',
        },
        convoId: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue', 'close'],
    setup(props, { emit }) {
        const tags = ref<any>(null);
        const nameTagHover = ref<any>(null);
        const imageList = ref<any>(null);
        const isMouseStopped = ref(false);
        const showDropdownTag = ref(false);
        const timer = ref<any>(null);
        const linebaseImageGallery = ref<any>(null);
        const isMouseOverButton = ref(false);
        const { getTags } = useTag();
        const envImageURL = `${process.env.VUE_APP_FILE_URL}`;
        //-1 begin, 0 between, 1 last
        const positionImage = ref(0);
        const activeImage = ref<any>({
            _id: '1',
        });

        const isEllipsisActive = (id: string) => {
            const e: any = document.getElementById(id);
            console.log({ e }, e.offsetWidth, e.scrollWidth);
            if (e.offsetWidth < e.scrollWidth) nameTagHover.value = id;
        };

        const onResetData = () => {
            positionImage.value = 0;
            imageList.value = null;
            activeImage.value = {
                _id: '1',
            };
        };

        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit('update:modelValue', value),
        });

        const btnCssAttr = computed(() => {
            return [
                'hover:bg-opacity-30',
                'active:border-2 active:border-neutrals-600',
                'focus:bg-neutrals-600',
                'focus-within: bg-neutrals-600',
            ];
        });

        const indexActiveImage = computed(() => {
            return imageList.value.findIndex((item: imageItem) => item._id === activeImage.value._id);
        });

        const getImagesByConvo = async ({ activeId, nextPage = null, prevPage = null }: any): Promise<any> => {
            let res: null | AxiosResponse<Res<any>> = null;
            res = await services.getImagesByConvo({
                convoId: props.convoId,
                activeId,
                nextPage,
                prevPage,
            });
            if (res) {
                const { data: resData } = res;
                const { error, data } = resData;
                if (!error && data) {
                    return Promise.resolve(data);
                } else if (error) {
                    return Promise.resolve(resData.message);
                }
            }
            return Promise.reject("Shouldn't be reachable");
        };

        const onGetImagelist = async ({ next = null, prev = null, activeId }: any) => {
            const nextPage = next;
            const prevPage = prev;
            try {
                console.log({ next, prev });
                if (!((next && positionImage.value == 1) || (prev && positionImage.value == -1))) {
                    const data = await getImagesByConvo({ convoId: props.convoId, activeId, nextPage, prevPage });
                    if ((nextPage || prevPage) && data.length) {
                        const dataIndexLength = data.length - 1;
                        if (nextPage) {
                            imageList.value = [
                                ...imageList.value.filter((item: any, index: number) => {
                                    return index > dataIndexLength;
                                }),
                                ...data,
                            ];
                        } else {
                            imageList.value = [
                                ...data,
                                ...imageList.value.filter((item: any, index: number) => {
                                    return index < imageList.value.length - dataIndexLength - 1;
                                }),
                            ];
                        }
                    } else {
                        if (!data.length) {
                            positionImage.value = next ? 1 : -1;
                        } else {
                            imageList.value = data;
                            positionImage.value = imageList.value[0]._id === activeImage.value._id ? -1 : 0;
                        }
                    }

                    //Check position
                    next =
                        indexActiveImage.value === imageList.value.length - 1
                            ? imageList.value[indexActiveImage.value]._id
                            : null;
                    prev = indexActiveImage.value === 0 ? imageList.value[indexActiveImage.value]._id : null;

                    if (next || prev) {
                        await onGetImagelist({
                            convoId: props.convoId,
                            activeId: props.activeImageId,
                            next,
                            prev,
                        });

                        // console.log('');
                    } else {
                        positionImage.value = 0;
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        onMounted(async () => {
            if (props.activeImageId) {
                await onGetImagelist({ activeId: props.activeImageId });
                activeImage.value = imageList.value.find((item: any) => item._id === props.activeImageId);
            }
            const element = document.getElementById('linebaseImageGallery');
            console.log('mounted', props.activeImageId, linebaseImageGallery.value, element);

            function mouseStopped() {
                // the actual function that is called
                isMouseStopped.value = true;
            }

            element?.addEventListener('mousemove', function () {
                isMouseStopped.value = false;

                clearTimeout(timer.value);
                timer.value = setTimeout(mouseStopped, 1000);
            });
        });

        const onCloseModal = () => {
            emit('update:modelValue', !visible.value);
            emit('close');
            visible.value = !visible.value;
        };

        const checkPositionImage = async () => {
            const next =
                indexActiveImage.value === imageList.value.length - 1
                    ? imageList.value[indexActiveImage.value]._id
                    : null;
            const prev = indexActiveImage.value === 0 ? imageList.value[indexActiveImage.value]._id : null;

            if (next || prev) {
                await onGetImagelist({
                    convoId: props.convoId,
                    activeId: props.activeImageId,
                    next,
                    prev,
                });

                // console.log('');
            } else {
                positionImage.value = 0;
            }
        };

        const onSelectImage = (item: imageItem) => {
            activeImage.value = item;
            // if (imageList.value.length === 15) {
            checkPositionImage();
            // }
        };

        const imageDate = computed(() => {
            return activeImage.value && activeImage.value.created_at
                ? filters.formatTime(activeImage.value.created_at, false, true)
                : null;
        });

        const onMoveImage = (number: number) => {
            if (imageList.value !== null) {
                if (
                    (indexActiveImage.value > 0 && number < 0) ||
                    (number > 0 && indexActiveImage.value < imageList.value.length - 1)
                ) {
                    activeImage.value = imageList.value[indexActiveImage.value + number];
                }

                checkPositionImage();
            }
        };

        watch(
            () => props.activeImageId,
            async () => {
                if (props.modelValue) {
                    await onGetImagelist({ activeId: props.activeImageId });
                    if (imageList.value)
                        activeImage.value = imageList.value.find((item: any) => item._id === props.activeImageId);
                    if (imageList.value.length == 1) {
                        positionImage.value = -2;
                    }
                }
            },
        );

        watch(
            activeImage,
            debounce(async (value) => {
                if (activeImage.value) {
                    if (value.tags && value.tags.length > 0) {
                        console.log('tag', value.tags.length);
                        const data = await getTags({ included_ids: value.tags });
                        const { data: tagList } = data;
                        tags.value = tagList.data;
                        console.log({ tags });
                    } else if (value.tags.length == 0) tags.value = [];
                    checkPositionImage();
                }
            }, 200),
        );

        watch(
            () => props.modelValue,
            () => {
                if (!props.modelValue) {
                    onResetData;
                }
            },
        );

        return {
            onMoveImage,
            visible,
            onCloseModal,
            imageList,
            activeImage,
            onSelectImage,
            btnCssAttr,
            envImageURL,
            imageDate,
            positionImage,
            isMouseStopped,
            isMouseOverButton,
            tags,
            isEllipsisActive,
            nameTagHover,
            showDropdownTag,
        };
    },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.image-slider {
    max-height: calc(100vh - 192px);
    &__image {
        max-height: calc(100vh - 192px);
    }
    &__list {
        &-item {
            &--unactive {
                opacity: 0.3;
                &:hover {
                    opacity: unset;
                }
            }
        }
    }
}
</style>
