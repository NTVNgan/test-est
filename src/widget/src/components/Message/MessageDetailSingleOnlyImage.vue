<template>
    <div class="msg-content-image">
        <template v-if="imageList.length === 1">
            <div class="h-full m-h-304" :class="position === 'left' ? 'image-left' : ''">
                <img
                    v-for="(image, key) in imageList"
                    :key="key"
                    class="object-cover inline-block w-inherit single-image cursor-pointer"
                    :src="envURL + '/' + image.src"
                    alt=""
                    @click="clickImage(image)"
                />
            </div>
        </template>
        <template v-else>
            <div
                v-for="(image, key) in imageList"
                :key="key"
                class="multi-image cursor-pointer h-76"
                :class="key === 0 ? 'image-first' : key === imageList.length - 1 ? 'image-last' : ''"
            >
                <img
                    class="object-cover inline-block w-inherit"
                    @click="clickImage(image)"
                    :src="envURL + '/' + image.src"
                    alt=""
                />
                <div class="count-image" v-if="image.hasImage" @click="clickImage(image)">
                    <span>+{{ image.countLastImage }}</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { computed, inject } from 'vue';

export default {
    name: 'MessageDetailSingleOnlyImage',
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
    },
    setup(props) {
        // eslint-disable-next-line no-undef
        const envURL = `${__process.env.VUE_APP_FILE_URL}`;
        const onOpenImageGallery = inject('onOpenImageGallery');
        const imageList = computed(() => {
            if (props.images.length < 4) return props.images;
            else {
                const images = props.images;
                images[2].hasImage = true;
                images[2].countLastImage = images.length - 2;
                return images.slice(0, 3);
            }
        });

        const clickImage = image => {
            onOpenImageGallery(image._id);
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
.h-full {
    height: 100%;
}
.msg-content-image {
    height: 100%;

    .inline-block {
        display: inline-block;
        vertical-align: middle;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .h-76 {
        height: 76px;
    }
    .m-h-304 {
        max-height: 304px;
    }

    .object-cover {
        -o-object-fit: cover;
        object-fit: cover;
    }
    .single-image {
        max-width: 236px;
        max-height: 304px;
        border-radius: 10px;
        height: 100%;
    }
    .image-left {
        img {
            max-width: 236px;
        }
    }
    .multi-image {
        display: inline-block;
        margin-right: 2px;

        img {
            width: 76px;
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
            font-size: 24px;
            line-height: 32px;
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
