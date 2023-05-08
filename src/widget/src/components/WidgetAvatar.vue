<template>
    <div class="flex items-center" :class="classComponent">
        <div
            class="avatar-content border flex items-center justify-center flex-shrink-0 rounded-full border-2 border-neutrals-100"
            :class="[classAtt, bgAvatar]"
            :style="{
                backgroundColor: bgAvatar,
            }"
        >
            <template v-if="!showImageTiny">
                <template v-if="!userRemoved">
                    <img v-if="image !== ''" :class="size" class="rounded-full object-cover" :src="image" alt="" />
                </template>
                <template v-else>
                    <img
                        v-if="image !== ''"
                        :class="size"
                        class="rounded-full object-cover"
                        src="../assets/images/no-user.svg"
                        alt=""
                    />
                </template>
                <div v-if="image === ''" :class="classText">{{ textAvatar }}</div>
            </template>
            <template v-else>
                <img v-if="checkImage" :class="size" class="rounded-full object-cover img-tiny" :src="image" alt="" />
                <div v-else :class="classText">{{ textAvatar }}</div>
            </template>
            <!-- <div v-if="online !== 3" class="online"></div> -->
            <div v-if="online !== 3" class="dot-status" :class="online == 1 ? 'online' : 'idle'"></div>
        </div>
        <div v-if="labelShow" class="ml-8p avatar-label">
            {{ labelAvatar }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, ref } from 'vue';

export default defineComponent({
    name: 'AvatarComponent',
    props: {
        labelShow: {
            // Show/hide name label
            type: Boolean,
            require: false,
            default: null,
        },
        labelAvatar: {
            // Name label
            type: String,
            require: true,
            default: '',
        },
        size: {
            // Width, Height
            type: String,
            require: false,
            default: 'h-40 w-40',
        },
        image: {
            // Image avatar
            type: String,
            require: false,
            default: '',
        },
        classText: {
            // Class for text avatar
            type: String,
            require: false,
            default: 'text-white',
        },
        classComponent: {
            // Add class for margin, padding or any style for component
            type: String,
            require: false,
            default: '',
        },
        bgAvatar: {
            type: String,
            default: '',
        },
        online: {
            type: Number,
            default: 3,
        },
        showImageTiny: {
            type: Boolean,
            default: false,
        },
        userRemoved: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const imageExtension = ref(['img', 'png']);
        const { labelAvatar } = toRefs(props);
        const { image } = toRefs(props);
        const textAvatar = computed(() => {
            if (labelAvatar.value == null) return '';
            const nameToArray = labelAvatar.value.split(' ');
            const fullName = nameToArray.slice(0, nameToArray.length).map(item => item.toUpperCase().substring(0, 1));
            let name = [fullName[0]];
            if (fullName.length > 1) name = [fullName[0], fullName[fullName.length - 1]];
            return name.join('');
        });

        const checkImage = computed(() => {
            if (image.value === '' || image.value === null || image.value === 'null') return false;
            const imageArray = image.value.split('.');
            if (imageArray.length < 2) return false;
            return imageExtension.value.includes(imageArray[imageArray.length - 1]);
        });

        const classAtt = computed(() => {
            return {
                'h-124 w-124 text-48 font-bold': props.size == 'extra-large' || props.size == 'l',
                'h-60 w-60 text-24 font-bold': props.size == 'large' || props.size == 'l',
                'h-40 w-40 text-16 font-medium': props.size == 'medium' || props.size == 'm',
                'h-32 w-32 text-14 font-medium': props.size == 'small' || props.size == 's',
                'h-20 w-20 text-10 font-normal': props.size == 'extra-small' || props.size == 'xs',
            };
        });

        return {
            textAvatar,
            classAtt,
            checkImage,
            imageExtension,
        };
    },
});
</script>

<style lang="scss" scoped>
.avatar-content img{
    width: 100%;
    object-fit: cover;
}
.avatar-content {
    position: relative;
    border: 1px solid #e9e9ec;
    box-sizing: border-box;
    .dot-status {
        width: 8px;
        height: 8px;
        border: 1px solid #e9e9ec;
        position: absolute;
        bottom: -1px;
        right: -1px;
        border-radius: 50%;
        box-sizing: content-box;
        &.online{
            background: #00c850;
        }
        &.idle{
            background: #FFB800;
        }
    }
}
.avatar-label {
    font-family: Roboto;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #fff;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.rounded-full {
    height: 100%;
}
.img-tiny {
    height: 60%;
    width: 60%;
}
.w-32 {
    width: 32px;
}
.text-14 {
    font-size: 14px;
    line-height: 20px;
}
.flex-shrink-0 {
    flex-shrink: 0;
}
.justify-center {
    justify-content: center;
}
.items-center {
    align-items: center;
}
.flex {
    display: flex;
}
.ml-8p {
    margin-left: 8px;
}
.text-white {
    color: #fff;
}
img,
video {
    max-width: 100%;
}
img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
    display: block;
    vertical-align: middle;
}
img {
    border-width: 0;
}
.h-32 {
    height: 32px;
}
.rounded-full {
    border-radius: 9999px;
}
</style>
