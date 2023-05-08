<template>
    <div class="emoji-picker">
        <div class="emoji-picker_body" id="emoji-picker_body">
            <div class="emoji-picker_body-scroll">
                <div
                    class="emoji-picker_body-item"
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
                        <h5 class="wrapper__title">{{ group.name }}</h5>
                    </div>
                    <div class="emoji-picker__emojis">
                        <template v-for="(emoji, i) in group.emojis">
                            <span class="item-emoji" @click="clickEmoji(emoji)" v-if="checkEmoji(emoji)" :key="i">
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
                    <Clock
                        class="icon-recently cursor-pointer"
                        :class="{ active: activeEmojiIndex === 0 }"
                        v-if="sec.key == 'recently' && sec.emojis.length > 0"
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

<script>
import { defineComponent, ref, reactive, onMounted, computed, nextTick, onBeforeUpdate, onUpdated } from 'vue';
import Slider from './slideCategory.vue';
import emoji, { getEmojiByUID } from './emojiData.ts';
import database, { dbName } from '../../database.ts';
import Clock from '../icons/Clock.vue';
import getContactInfo from '../../contactInfo.ts';

export default defineComponent({
    name: 'EmojiPicker',
    components: {
        Slider,
        Clock,
    },
    props: {
        contactVisitor: {
            type: String,
            default: '',
        },
    },
    setup(props, { emit }) {
        const emojiData = reactive(emoji);
        const activeEmojiIndex = ref(0);
        const isShow = ref(false);

        const contactInfoID = ref(props.contactVisitor);

        const updateSlideNumber = () => {
            const parentSlide = document.getElementById('emoji-picker_body');
            const mainNavLinks = document.querySelectorAll('.slider-component__cate .icon a');
            parentSlide.addEventListener('scroll', (event) => {
                const fromTop = parentSlide.scrollTop;
                mainNavLinks.forEach((link) => {
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

        const showTabFirst = async () => {
            await database.getItem(dbName.emoji, (err, value) => {
                const indexedDB = value[contactInfoID.value];
                if (indexedDB.length > 0) {
                    if (emojiData[0].key != 'recently') {
                        emojiData.unshift({ name: 'Frequently used', key: 'recently', img: '', emojis: [] });
                    }
                    emojiData[0].emojis = indexedDB ? getEmojiByUID(indexedDB) : [];
                }
                isShow.value = true;
            });
        };

        const positionEmojiX = (position_x) => {
            const width = 5200 / 2652;
            const positionX = width * position_x + '%';
            return positionX;
        };

        const positionEmojiY = (position_y) => {
            const width = 5200 / 2652;
            const positionY = width * position_y + '%';
            return positionY;
        };

        const count = (names) => names.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});

        const duplicates = (dict) => Object.keys(dict).filter((a) => dict[a] > 5);

        const clickEmoji = async (emoji) => {
            // const emojiDB = await database.getItem(dbName.listEmoji);
            // const userEmojiBD = emojiDB ? emojiDB[contactInfoID.value] : [];
            // const numberDup = duplicates(count(userEmojiBD));
            // if (emojiData[0].key == 'recently') {
            //     emojiData[0].emojis = indexedDB ? getEmojiByUID(numberDup) : []
            // }

            emit('add-emoji', emoji);
        };

        const divs = ref([]);

        const goto = (refName) => {
            activeEmojiIndex.value = refName;
            const element = divs.value[refName];
            element.scrollIntoView();
        };

        const checkEmoji = (val) => {
            const codepointArray = val.unified.split('-').map((item) => `0x${item}`);
            return codepointArray && codepointArray.length === 1;
        };

        onBeforeUpdate(() => {
            divs.value = [];
        });
        onUpdated(() => {
            updateSlideNumber();
        });
        onMounted(() => {
            showTabFirst();
        });

        return {
            // userStore,
            emojiData,
            showTabFirst,
            activeEmojiIndex,
            positionEmojiX,
            positionEmojiY,
            clickEmoji,
            goto,
            divs,
            isShow,
            contactInfoID,
            checkEmoji,
        };
    },
});
</script>

<style lang="scss" scoped>
.emoji-picker {
    height: 172px;
    font-family: 'Roboto';
    .img-emoji {
        width: 20px;
        height: 20px;
        object-fit: cover;
        display: inline-block;
        background-size: 5200%;
        // background-image: var(--linebase-resource-url);
    }
    &_body {
        overflow-y: scroll;
        height: calc(100% - 32px);
        &-item {
            scroll-margin-top: 8px;
        }
        &-scroll {
            padding: 0 12px 12px;
        }
        &-above {
            .wrapper__title {
                font-weight: 500;
                font-size: 12px;
                line-height: 16px;
                color: #828292;
                margin-bottom: 8px;
                margin-top: 0px;
                font-family: 'Roboto';
            }
        }
        &-item {
            padding-bottom: 8px;
            &:first-child {
                padding-top: 12px;
            }
            &:last-child {
                padding-bottom: 0;
            }
        }
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-track {
            background: #ffffff;
            width: 12px;
        }
        &::-webkit-scrollbar-thumb {
            background: #b4b4be;
            border-radius: 8px;
            border: 4px solid #ffffff;
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
            align-items: center;
            display: flex;
            width: 20px;
            height: 20px;
            justify-content: center;
        }
    }
}
</style>