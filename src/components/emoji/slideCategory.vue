<template>
    <div class="slide-component__emoji relative">
        <div
            class="
                slider-component__navigate
                absolute
                w-24
                h-24
                z-10
                cursor-pointer
            "
            :class="[{
                'hover:bg-white text-neutrals-100 cursor-not-allowed': activePositionIndex === 1,
            }, activePositionIndex !== 1 ? 'left-4p' : '-left-12p']"
            @click="onNavigate(-1)"
            v-show="activePositionIndex !== 1"
        >
            <icon-component
                class="flex justify-center items-center h-full"
                name="chevron-left"
                color="neutrals-400"
            />
        </div>
        <div
            class="
                slider-component__navigate
                absolute
                w-24
                h-24
                z-10
                cursor-pointer
            "
            :class="[{
                'hover:bg-white text-neutrals-100 cursor-not-allowed': activePositionIndex === totalSlide,
            }, activePositionIndex !== totalSlide ? 'right-4p' : '-right-12p']"
            @click="onNavigate(1)"
            v-show="activePositionIndex !== totalSlide"
        >
            <icon-component
                class="flex justify-center items-center h-full"
                name="chevron-right"
                color="neutrals-400"
            />
        </div>
        <div class="slider-component relative">
            <div class="slider relative" :style="{ height }">
                <div class="slider-component__item inline-block" :class="{'pl-28p pr-28p': activePositionIndex !== 1 && activePositionIndex !== totalSlide}" v-for="(tabs, i) in slideCate" :key="i">
                    <div class="slider-component__cate grid">
                        <div class="icon" v-for="(tab, i) of tabs" :key="i">
                            <component :is="tab"></component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="$slots?.title" class="w-full text-center mt-4p">
            <slot name="title"></slot>
        </div>
        <div class="slider-component__bullets flex justify-center mt-24p" v-if="dotted">
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
import IconComponent from '@/components/ui/IconComponent.vue';
export default {
    name: 'SliderComponent',
    components: {
        IconComponent,
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
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 2px 10px rgba(0, 0, 0, 0.1);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    .slider-component{
        position: relative;
        overflow: hidden;
        height: 100%;
        .slider {
            min-height: inherit;
            height: 100%;
            white-space: nowrap;
            transition: 0.8s;
            & > *:not(.slider-component__navigate) {
                min-height: inherit;
                height: 100%;
                width: 100%;
                
            }
        }
        &__item{
            &:first-child{
                padding-left: 4px;
                padding-right: 28px;
            }
            &:last-child{
                padding-right: 4px;
                padding-left: 28px;
            }
        }
        &__cate{
            grid-template-columns: repeat(7, 1fr);
            grid-gap: 4px;
            height: 100%;
            *{
                display: flex;
                align-items: center;
                justify-content: center;
            }
            :deep(.icon){
                .content{
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &::before{
                        content: '';
                        width: 24px;
                        height: 24px;
                        position: absolute;
                        background: #E9E9EC;
                        border-radius: 4px;
                        display: none;
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
                    margin: 0;
                    transform: none;
                }
                .icon-recently{
                    z-index: 1;
                    svg{
                        width: 16px;
                        height: 16px;
                    }
                }
            }
        }
    }
}

</style>