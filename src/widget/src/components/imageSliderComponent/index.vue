<template>
    <transition enter-active-class="duration-300" leave-active-class="duration-200">
        <div id="linebaseImageGallery" ref="linebaseImageGallery" class="image-slider-widget">
            <transition
                enter-active-class="duration-300 ease-out opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="duration-200 ease-in"
                leave-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div @click="confirm ? onCloseModal : () => true" v-show="visible" class="image-slider-widget__layer">
                    <div class=""></div>
                </div>
            </transition>

            <transition
                enter-active-class="duration-300 ease-out translate-y-4 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="duration-200 ease-in"
                leave-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-4 opacity-0"
            >
                <div v-show="visible" class="image-slider-widget__content-wrapper">
                    <div class="image-slider-widget__content">
                        <div class="image-slider-widget__content-header">
                            <div class="image-slider-widget__content-header-time">
                                <InfoCircleWhite name="InfoCircleWhite" />
                                <!-- <icon-component name="InfoCircleWhite" class="mr-4p" color="white"></icon-component> -->
                                <span> {{ imageDate }} </span>
                                <!-- Yesterday 09:02 AM -->
                            </div>
                            <div
                                class="image-slider-widget__content-header-close image-slider-widget__button"
                                tabindex="1"
                                @click="onCloseModal"
                            >
                                <Times name="Times" />
                            </div>
                        </div>
                        <div class="image-slider-widget__image">
                            <template v-if="positionImage !== -2">
                                <div
                                    class="
                                        image-slider-widget__button
                                        image-slider-widget__navigate
                                        image-slider-widget__navigate--left
                                    "
                                    tabindex="1"
                                    @click="onMoveImage(-1)"
                                    @mouseover="isMouseOverButton = true"
                                    @mouseleave="isMouseOverButton = false"
                                    v-if="(!isMouseStopped || isMouseOverButton) && positionImage !== -1"
                                >
                                    <chevron-left-regular />
                                </div>
                                <div
                                    class="
                                        image-slider-widget__button
                                        image-slider-widget__navigate
                                        image-slider-widget__navigate--right
                                    "
                                    tabindex="1"
                                    @click="onMoveImage(1)"
                                    @mouseover="isMouseOverButton = true"
                                    @mouseleave="isMouseOverButton = false"
                                    v-if="(!isMouseStopped || isMouseOverButton) && positionImage !== 1"
                                >
                                    <chevron-right-regular />
                                </div>
                            </template>
                            <div class="image-slider-widget__image-full">
                                <img
                                    v-if="activeImage && activeImage.url"
                                    class="select-none object-contain"
                                    :src="envImageURL + '/' + activeImage.url"
                                    alt="hình nè"
                                    srcset=""
                                />
                            </div>
                        </div>
                        <div class="image-slider-widget__list">
                            <div class="flex">
                                <div
                                    class="image-slider-widget__list-item"
                                    :class="{
                                        'image-slider-widget__list-item--unactive':
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

<script>
import { defineComponent, computed, ref, onMounted, watch } from 'vue';
import InfoCircleWhite from '../icons/InfoCircleWhite.vue';
import Times from '../icons/Times.vue';
import ChevronRightRegular from '../icons/ChevronRightRegular.vue';
import ChevronLeftRegular from '../icons/ChevronLeftRegular.vue';
import { useImageGallery } from '../../composables/useImageGallery';
import filters from '../../utils/filters';

export default defineComponent({
    name: 'ImageSliderComponent',
    components: {
        Times,
        InfoCircleWhite,
        ChevronRightRegular,
        ChevronLeftRegular,
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
        const { getImagesGalleryByConvo } = useImageGallery();
        const imageList = ref([]);
        const isMouseStopped = ref(false);
        const timer = ref(null);
        const linebaseImageGallery = ref(null);
        const isMouseOverButton = ref(false);
        // eslint-disable-next-line no-undef
        const envImageURL = `${__process.env.VUE_APP_FILE_URL}`;
        //-1 begin, 0 between, 1 last
        const positionImage = ref(0);
        const activeImage = ref(null);

        const onResetData = () => {
            positionImage.value = 0;
            imageList.value = null;
        };

        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit('update:modelValue', value),
        });

        const getImagesByConvo = async ({ activeId, nextPage = null, prevPage = null }) => {
            let res = null;
            res = await getImagesGalleryByConvo({
                convoId: props.convoId,
                activeId,
                nextPage,
                prevPage,
            });
            console.log('data', { res });
            if (res) {
                const { error, data } = res;
                if (!error && data) {
                    return Promise.resolve(data);
                } else if (error) {
                    return Promise.resolve(false);
                }
            }
            return Promise.reject("Shouldn't be reachable");
        };

        const onGetImagelist = async ({ next = null, prev = null, activeId }) => {
            const nextPage = next;
            const prevPage = prev;
            try {
                console.log({ next, prev });
                if (!((next && positionImage.value == 1) || (prev && positionImage.value == -1))) {
                    const data = await getImagesByConvo({ convoId: props.convoId, activeId, nextPage, prevPage });
                    if ((nextPage || prevPage) && data.length) {
                        console.log('hello');
                        const dataIndexLength = data.length - 1;
                        if (nextPage) {
                            console.log('nextPage', dataIndexLength);
                            imageList.value = [
                                ...imageList.value.filter((item, index) => {
                                    return index > dataIndexLength;
                                }),
                                ...data,
                            ];
                        } else {
                            imageList.value = [
                                ...data,
                                ...imageList.value.filter((item, index) => {
                                    return index < imageList.value.length - dataIndexLength - 1;
                                }),
                            ];
                        }
                    } else {
                        if (!data.length) {
                            positionImage.value = next ? 1 : -1;
                        } else {
                            positionImage.value = 0;
                            imageList.value = data;
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        onMounted(async () => {
            if (props.activeImageId) {
                await onGetImagelist({ activeId: props.activeImageId });
                activeImage.value = imageList.value.find((item) => item._id === props.activeImageId);
                if (imageList.value.length === 1) positionImage.value = -2;
            }
            const element = document.getElementById('linebaseImageGallery');
            console.log('mounted', props.activeImageId, linebaseImageGallery.value, element);

            function mouseStopped() {
                // the actual function that is called
                isMouseStopped.value = true;
            }

            element.addEventListener('mousemove', function () {
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

        const indexActiveImage = computed(() => {
            return imageList.value.findIndex((item) => item._id === activeImage.value._id);
        });

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

        const onSelectImage = (item) => {
            activeImage.value = item;
            if (imageList.value.length === 15) {
                checkPositionImage();
            }
        };

        const imageDate = computed(() => {
            return activeImage.value && activeImage.value.created_at
                ? filters.formatTime(activeImage.value.created_at, false, true)
                : null;
        });

        const onMoveImage = (number) => {
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
                await onGetImagelist({ activeId: props.activeImageId });
                if (imageList.value) {
                    activeImage.value = imageList.value.find((item) => item._id === props.activeImageId);
                    if (imageList.value.length === 1) positionImage.value = -2;
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
            envImageURL,
            imageDate,
            positionImage,
            isMouseStopped,
            isMouseOverButton,
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

.duration {
    &-200 {
        transition-duration: 200ms;
    }
    &-300 {
        transition-duration: 300ms;
    }
}

.ease {
    &-out {
        transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    &-in {
        transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
    }
}

.opacity {
    &-0 {
        opacity: 0;
    }
    &-100 {
        opacity: 1;
    }
}

.translate {
    &-y {
        &-0 {
            transform: translateY(0px);
        }
        &-4 {
            transform: translateY(1rem);
        }
    }
}

.image-slider-widget {
    max-height: calc(100vh - 192px);
    position: fixed;
    left: 0px;
    right: 0px;
    color: #141417;
    z-index: 99999;
    &__layer {
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        transition-property: opacity;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        & > div {
            position: absolute;
            color: #e9e9ec;
            transition-property: all;
            background: rgba(20, 20, 23, 0.9);
            backdrop-filter: blur(5px);
            width: 100vw;
            height: 100vh;
        }
    }
    &__content-wrapper {
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        transition-property: opacity;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
    }
    &__content {
        position: fixed;
        // padding-right: 24px;
        // padding-left: 24px;
        padding-top: 8px;
        padding-bottom: 16px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        &-header {
            padding-right: 24px;
            padding-left: 24px;
            color: white;
            display: flex;
            font-size: 14px;
            line-height: 20px;
            color: #e9e9ec;
            justify-content: space-between;
            &-close {
                border-radius: 4px;
            }
            &-time {
                > i {
                    margin-right: 4px;
                }
                display: flex;
                align-items: center;
            }
        }
    }
    &__button {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(20, 20, 23, 0.4);
        cursor: pointer;
        &:hover {
            background-color: rgba(20, 20, 23, 0.7);
        }
        &:focus {
            background-color: rgba(85, 85, 98, 0.4);
        }
        &:focus-within {
            background-color: rgba(85, 85, 98, 0.4);
        }
        &:active {
            border: 1px;
            border-width: 2px;
            border-color: rgba(85, 85, 98, 0.4);
        }
    }
    &__image {
        max-height: calc(100vh - 192px);
        flex-grow: 1;
        margin-top: 18px;
        position: relative;
        padding-right: 24px;
        padding-left: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &-full {
            display: flex;
            justify-content: center;
            padding-right: 24px;
            padding-left: 24px;
            max-height: calc(100vh - 192px);
            & > img {
                user-select: none;
                object-fit: contain;
            }
        }
    }
    &__navigate {
        position: absolute;
        border-radius: 9999px;
        width: 66px;
        height: 66px;
        z-index: 10px;
        box-shadow: 0 2px 20px 0 rgb(0 0 0 / 10%), 0 0 2px 0 rgb(0 0 0 / 10%);
        top: 50%;
        &--left {
            fill: white;
            left: 24px;
            transform: translateX(-12px);
        }
        &--right {
            fill: white;
            right: 24px;
            transform: translateX(12px);
        }
    }
    &__list {
        height: 64px;
        display: flex;
        justify-content: center;
        padding-top: 56px;
        transform: translateY(-16px);
        & > div {
            display: flex;
        }
        &-item {
            height: 64px;
            width: 64px;
            overflow: hidden;
            margin-right: 6px;
            margin-left: 6px;
            cursor: pointer;
            border-radius: 4px;
            & > img {
                user-select: none;
                object-fit: cover;
                width: 100%;
                height: 100%;
            }
            &--unactive {
                opacity: 0.4;
                &:hover {
                    opacity: unset;
                }
            }
        }
    }
}
</style>
