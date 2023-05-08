<template>
    <div class="msg-content-image" :class="position !== 'left' ? 'flex justify-end' : ''">
        <template v-if="imageList.length === 1">
            <div
                class="h-full"
                :class="
                    (position === 'left' ? 'image-left' : '', is_whisper ? 'px-16p py-10p bg-warning-5 img-note' : '')
                "
            >
                <img
                    v-for="(image, key) in imageList"
                    :key="key"
                    class="object-cover w-inherit single-image cursor-pointer"
                    :src="envURL + '/' + image.src"
                    alt=""
                    @click="clickImage(image)"
                />
            </div>
        </template>
        <template v-else>
            <div :class="is_whisper ? 'px-16p py-10p bg-warning-5 img-note-multi' : ''">
                <div
                    v-for="(image, key) in imageList"
                    :key="key"
                    class="multi-image cursor-pointer"
                    :class="key === 0 ? 'image-first' : key === imageList.length - 1 ? 'image-last' : ''"
                >
                    <img
                        class="object-cover w-inherit multi"
                        @click="clickImage(image)"
                        :src="envURL + '/' + image.src"
                        alt=""
                    />
                    <div class="count-image" v-if="image.hasImage" @click="clickImage(image)">
                        <span>+{{ image.countLastImage }}</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { computed, toRefs, inject } from 'vue';

export default {
    name: 'InboxMessageDetailSingleOnlyImage',
    props: {
        images: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        position: {
            type: String,
            default: '',
        },
        is_whisper: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any) {
        const envURL = process.env.VUE_APP_FILE_URL;
        const emitter: any = inject('emitter');

        const imageList = computed(() => {
            if (props.images.length < 4) return props.images;
            else {
                const images = props.images;
                images[2].hasImage = true;
                images[2].countLastImage = images.length - 2;
                return images.slice(0, 3);
            }
        });

        const clickImage = (image: any) => {
            emitter.emit('onClickImage', image._id);
            console.log('image-Id-2', image._id);
        };

        return {
            imageList,
            clickImage,
            envURL,
        };
    },
};
</script>
<style lang="scss" scoped>
.msg-content-image {
    height: 100%;

    img {
        vertical-align: middle;
        display: inline-block;
    }

    .single-image {
        max-width: 392px;
        max-height: 360px;
        border-radius: 10px;
        height: 100%;
    }
    .image-left {
        img {
            max-width: 384px;
        }
    }
    .multi-image {
        height: 120px;
        display: inline-block;
        margin-right: 2px;

        img {
            width: 120px;
            height: 100%;
        }

        &:last-child {
            margin-right: 0;
        }

        .count-image {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            right: 0;
            bottom: 0;
            color: #fff;
            font-weight: 600;
            font-size: 32px;
            line-height: 48px;
            background: #1414179e;
            border-radius: 0 10px 10px 0;

            span {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }

    .img-note {
        border-radius: 4px;
        border: 1px solid #ffd466;
        overflow: hidden;

        .single-image {
            max-width: 358px;
            max-height: 338px;
        }
    }

    .img-note-multi {
        border-radius: 4px;
        border: 1px solid #ffd466;
        overflow: hidden;
        height: 132px;

        .multi-image {
            height: 112px;

            img {
                width: 112px;
            }
        }
    }

    .image-first {
        img {
            border-radius: 10px 0 0 10px;
        }
    }
    .image-last {
        position: relative;

        img {
            border-radius: 0 10px 10px 0;
        }
    }
}
</style>
