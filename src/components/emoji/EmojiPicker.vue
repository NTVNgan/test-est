<template>
    <div class="emoji-picker">
        <div class="emoji-picker_body px-12p pb-12p scrollbar--transparent" id="emoji-picker_body">
            <div
                class="pb-8p first:pt-12p last:pt-0"
                v-for="(group, i) in emojiData"
                :key="i"
                :id="'div' + i"
                :ref="
                    (el) => {
                        divs[i] = el;
                    }
                "
            >
                <div class="emoji-picker_body-above">
                    <h5 class="wrapper__title text-12 text-neutrals-400 mb-8p font-medium">{{ group.name }}</h5>
                </div>
                <div class="emoji-picker__emojis">
                    <template v-for="(emoji, i) in group.emojis">
                        <span class="item-emoji" @click="clickEmoji(emoji)" :key="i" v-if="checkEmoji(emoji)">
                            <span
                                :style="{
                                    backgroundPositionX: positionEmojiX(emoji.sheet_x),
                                    backgroundPositionY: positionEmojiY(emoji.sheet_y),
                                }"
                                class="img-emoji"
                            ></span>
                        </span>
                    </template>
                </div>
            </div>
        </div>
        <div class="emoji-picker_stabs">
            <slider :numberSlide="6" height="32px" v-if="isShow">
                <a
                    :id="'#div' + index"
                    @click="goto(index)"
                    class="content"
                    :class="{ current: index === 0 }"
                    v-for="(sec, index) in emojiData"
                    :key="index"
                >
                    <icon-component
                        name="clock"
                        class="icon-recently cursor-pointer"
                        v-if="sec.key == 'recently' && sec.emojis.length > 0"
                        :class="{ active: activeEmojiIndex === 0 }"
                        color="neutrals-400"
                    />
                    <span
                        v-if="sec.key != 'recently'"
                        :style="{
                            backgroundPositionX: positionEmojiX(sec.img_position_x),
                            backgroundPositionY: positionEmojiY(sec.img_position_y),
                        }"
                        class="img-emoji cursor-pointer"
                    ></span>
                </a>
            </slider>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed, nextTick, onBeforeUpdate, onUpdated } from 'vue';
import Slider from './slideCategory.vue';
import emoji, { getEmojiByUID } from './emojiData';
import database, { dbName } from '@/database';
import { store } from '@/store';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'EmojiPicker',
    components: {
        Slider,
        IconComponent,
    },
    props: {
        frequentlyDBKey: {
            type: String,
            default: 'emoji',
        },
    },
    setup(props, { emit }) {
        const emojiData = reactive<any[]>(emoji);
        const activeEmojiIndex = ref<number>(0);
        const userStore: any = computed(() => {
            return store.state.auth.user;
        });
        const isShow = ref<boolean>(false);

        const updateSlideNumber = () => {
            const parentSlide: any = document.getElementById('emoji-picker_body');
            const mainNavLinks = document.querySelectorAll('.slider-component__cate .icon a');
            parentSlide.addEventListener('scroll', (event: any) => {
                const fromTop = parentSlide.scrollTop;
                mainNavLinks.forEach((link: any) => {
                    const section = document.querySelector(link.id);
                    if (
                        section.offsetTop - parentSlide.offsetTop - 8 <= fromTop &&
                        section.offsetTop - parentSlide.offsetTop - 8 + section.offsetHeight > fromTop
                    ) {
                        link.classList.add('current');
                    } else {
                        link.classList.remove('current');
                    }
                });
            });
        };

        const showTabFrequentlyUsed = async () => {
            await database.getItem(dbName[props.frequentlyDBKey], (err, value: any) => {
                const indexedDB = value[userStore.value._id];
                if (indexedDB.length === 0 && emojiData[0].key === 'recently') {
                    emojiData.splice(0, 1);
                }
                if (indexedDB.length > 0) {
                    if (emojiData[0].key != 'recently') {
                        emojiData.unshift({ name: 'Frequently used', key: 'recently', img: '', emojis: [] });
                    }
                    emojiData[0].emojis = indexedDB ? getEmojiByUID(indexedDB) : [];
                }
                isShow.value = true;
            });
        };

        const positionEmojiX = (position_x: any) => {
            const width = 5200 / 2652;
            const positionX = width * position_x + '%';
            return positionX;
        };

        const positionEmojiY = (position_y: any) => {
            const width = 5200 / 2652;
            const positionY = width * position_y + '%';
            return positionY;
        };

        const count = (names: any) => names.reduce((a: any, b: any) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});

        const duplicates = (dict: any) => Object.keys(dict).filter((a) => dict[a] > 5);

        const clickEmoji = async (emoji: any) => {
            // const emojiDB: any = await database.getItem(dbName.listEmoji);
            // const userEmojiBD = emojiDB ? emojiDB[userStore.value._id] : [];
            // const numberDup = duplicates(count(userEmojiBD));
            // if (emojiData[0].key == 'recently') {
            //     emojiData[0].emojis = indexedDB ? getEmojiByUID(numberDup) : []
            // }
            emit('add-emoji', emoji);
        };

        const divs = ref<HTMLInputElement[]>([]);

        const goto = (refName: any) => {
            activeEmojiIndex.value = refName;
            const element = divs.value[refName];
            // element?.scrollIntoView({behavior: "smooth"});
            element?.scrollIntoView();
        };

        const checkEmoji = (val: any) => {
            const codepointArray = val.unified.split('-').map((item: any) => `0x${item}`);
            return codepointArray && codepointArray.length === 1;
        };

        onBeforeUpdate(() => {
            divs.value = [];
        });
        onUpdated(() => {
            updateSlideNumber();
        });

        onMounted(() => {
            showTabFrequentlyUsed();
        });

        return {
            userStore,
            emojiData,
            showTabFrequentlyUsed,
            activeEmojiIndex,
            positionEmojiX,
            positionEmojiY,
            clickEmoji,
            goto,
            divs,
            isShow,
            checkEmoji,
        };
    },
});
</script>

<style lang="scss" scoped>
.emoji-picker {
    height: 200px;
    .img-emoji {
        width: 20px;
        height: 20px;
        object-fit: cover;
        display: inline-block;
        background-size: 5200%;
        background-image: url('./emoji.png');
    }
    &_body {
        overflow-y: scroll;
        height: calc(100% - 32px);
        > * {
            scroll-margin-top: 8px;
            // &:first-child{
            //     // scroll-margin-top: 12px;
            // }
        }
    }
    &__emojis {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-gap: 4px;
        .item-emoji {
            flex-basis: 10%;
            flex-grow: 0;
            border-radius: 4px;
            text-align: center;
            cursor: pointer;
        }
    }
}
</style>