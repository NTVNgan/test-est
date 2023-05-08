<template>
    <div class="slide-component__emoji relative">
        <div
            class="
                slider-component__navigate
                arrow-left
            " @click="onNavigate(-1)"
            v-show="activePositionIndex !== 1"
        >
            <chevron-left class="icon-arrow" />
        </div>
        <div
            class="
                slider-component__navigate
                arrow-right
            "
            @click="onNavigate(1)"
            v-show="activePositionIndex !== totalSlide"
        >
            <chevron-right class="icon-arrow" />
        </div>
        <div class="slider-component">
            <div class="slider" :style="{ height }">
                <div class="slider-component__item" v-for="(tabs, i) in slideCate" :key="i">
                    <div class="slider-component__cate">
                        <div class="icon-store" v-for="(tab, i) of tabs" :key="i">
                            <component :is="tab"></component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="$slots.title" class="title">
            <slot name="title"></slot>
        </div>
        <div class="slider-component__bullets" v-if="dotted">
            <div
                v-for="num in totalSlide"
                class="text-black w-8 h-8 rounded-full mx-4p cursor-pointer"
                :class="{
                    'bg-neutrals-100': activePositionIndex !== num,
                    'bg-neutrals-500': activePositionIndex === num,
                }"
                :key="num"
                @click="onChangeSlide(num)"
            ></div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUpdated, computed } from 'vue';
import ChevronRight from '../icons/ChevronRight.vue';
import ChevronLeft from '../icons/ChevronLeft.vue';
// import IconComponent from '@/components/ui/IconComponent.vue';
export default {
    name: 'SliderComponent',
    components: {
        // IconComponent,
        ChevronRight,
        ChevronLeft
    },
    props: {
        width: {
            type: String,
            default: '500px',
        },
        height: {
            type: String,
            default: '500px',
        },
        dotted: {
            type: Boolean,
            default: false,
        },
        numberSlide: {
            type: Number,
            default: 1,
        }
    },
    setup(props, { slots }) {
        const totalSlide = ref(0);
        const activePositionIndex = ref(1);
        const onChangeSlide = (num) => {
            const el = document.querySelector(`.slider`);
            el.style.transform = `translateX(-${(num - 1) * 100}%)`;
            activePositionIndex.value = num;
        };

        const arrayToMatrix = (array, columns) => Array(Math.ceil(array.length / columns)).fill('').reduce((acc, cur, index) => {
            return [...acc, [...array].splice(index * columns, columns)]
        }, []);

        const tabs = computed(() => {
            const tabs = [];
            slots.default().forEach(child => {
                tabs.push(child);
            });
            
            return tabs;
        });

        const slideCate = computed(() => {
            const slide = [];
            if (tabs.value){
                const matrix = arrayToMatrix(tabs.value[0].children, props.numberSlide+1);
                matrix.forEach(child => {
                    slide.push(child);
                });
            }
            return slide;
        });

        const updateTotalSlideNumber = () => {
            const elSlider = document.querySelector('.slider');
            const elNavigate = document.querySelectorAll('.slider-component__navigate');
            elNavigate.forEach((item) => {
                item.style.top = elSlider.offsetHeight / 2 - (item.offsetHeight * 1) / 2 + 'px';
            });
            const el = document.querySelectorAll(`.slider > *`);
            // totalSlide.value = el.length;
            if (tabs.value){
                const lengthTab = tabs.value[0].children.length;
                const numberSlide = lengthTab/props.numberSlide;
                if (!Number.isInteger(numberSlide)){
                    if (parseInt(numberSlide.toFixed(0)) < numberSlide){
                        totalSlide.value = parseInt(numberSlide.toFixed(0)) + 1;
                    } else {
                        totalSlide.value = parseInt(numberSlide.toFixed(0));
                    }
                }
            }
        };

        const onNavigate = (num) => {
            if (num === -1 && activePositionIndex.value === 1) return;
            if (num === 1 && activePositionIndex.value === totalSlide.value) return;

            return onChangeSlide(activePositionIndex.value + num);
        };

        onMounted(() => {
            updateTotalSlideNumber();
        });

        onUpdated(() => {
            updateTotalSlideNumber();
        });

        return {
            totalSlide,
            activePositionIndex,
            onChangeSlide,
            updateTotalSlideNumber,
            onNavigate,
            tabs,
            slideCate
        };
    },
};
</script>

<style lang="scss" scoped>
.slide-component__emoji{
    position: relative;
    border-bottom-left-radius: 8px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 2px 10px rgba(0, 0, 0, 0.1);
    border-bottom-right-radius: 8px;
    .slider-component{
        position: relative;
        overflow: hidden;
        .slider {
            min-height: inherit;
            height: 100%;
            white-space: nowrap;
            transition: 0.8s;
            & > *:not(.slider-component__navigate) {
                min-height: inherit;
                // display: inline-block;
                height: 100%;
                width: 100%;
            }
        }
        &__item{
            display: inline-block;
            &:first-child{
                .slider-component__cate{
                    padding-left: 4px;
                    padding-right: 28px;
                }
            }
            &:last-child{
                .slider-component__cate{
                    padding-right: 4px;
                    padding-left: 28px;
                }
            }
        }
        &__cate{
            grid-template-columns: repeat(7, 1fr);
            grid-gap: 4px;
            height: 100%;
            display: grid;
            *{
                display: flex;
                align-items: center;
                justify-content: center;
            }
            :deep(.icon-store){
                > .content{
                    position: relative;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    &::before{
                        content: '';
                        width: 24px;
                        height: 24px;
                        position: absolute;
                        background: #E9E9EC;
                        border-radius: 4px;
                        display: none;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    &:hover{
                        &::before{
                            display: block;
                        }
                    }
                    &.current{
                        &::before{
                            display: block;
                        }
                    }
                }
                .img-emoji{
                    width: 16px;
                    height: 16px;
                    z-index: 1;
                    transform: none;
                    margin-bottom: 0;
                }
                .icon-recently{
                    width: 16px;
                    height: 16px;
                    z-index: 1;
                }
            }
        }
        &__navigate{
            position: absolute;
            width: 24px;
            height: 24px;
            z-index: 10;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            &.arrow{
                &-left{
                    left: 4px;
                }
                &-right{
                    right: 4px;
                }
            }
        }
    }
}

</style>