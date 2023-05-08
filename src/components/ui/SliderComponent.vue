<template>
    <div class="relative">
        <div
            class="
                slider-component__navigate
                absolute
                rounded-full
                bg-white
                w-24
                h-24
                z-10
                cursor-pointer
                -left-12p
                shadow-2p
            "
            :class="{
                'hover:bg-white text-neutrals-100 cursor-not-allowed': activePositionIndex === 1,
                'hover:bg-neutrals-50 text-black': activePositionIndex !== 1,
            }"
            @click="onNavigate(-1)"
        >
            <icon-component
                class="flex justify-center items-center h-full"
                name="angle-left"
                :color="activePositionIndex == 1 ? 'neutrals-100' : 'black'"
            />
        </div>
        <div
            class="
                slider-component__navigate
                absolute
                rounded-full
                bg-white
                w-24
                h-24
                z-10
                cursor-pointer
                -right-12p
                shadow-2p
            "
            :class="{
                'hover:bg-white text-neutrals-100 cursor-not-allowed': activePositionIndex === totalSlide,
                'hover:bg-neutrals-50 text-black': activePositionIndex !== totalSlide,
            }"
            @click="onNavigate(1)"
        >
            <icon-component
                class="flex justify-center items-center h-full"
                name="angle-right"
                :color="activePositionIndex == totalSlide ? 'neutrals-100' : null"
            />
        </div>
        <div class="slider-component relative" :style="{ height }">
            <div class="slider relative">
                <slot></slot>
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
import { ref, onMounted, onUpdated } from 'vue';
import IconComponent from './IconComponent.vue';
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
    },
    setup() {
        const totalSlide = ref(0);
        const activePositionIndex = ref(1);
        const onChangeSlide = (num) => {
            const el = document.querySelector(`.slider`);
            el.style.transform = `translateX(-${(num - 1) * 100}%)`;
            activePositionIndex.value = num;
        };
       

        const updateTotalSlideNumber = () => {
            const elSlider = document.querySelector('.slider');
            const elNavigate = document.querySelectorAll('.slider-component__navigate');
            elNavigate.forEach((item) => {
                item.style.top = elSlider.offsetHeight / 2 - (item.offsetHeight * 1) / 2 + 'px';
            });
            const el = document.querySelectorAll(`.slider > *`);
            totalSlide.value = el.length;
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
        };
    },
};
</script>

<style lang="scss" scroped>
.slider-component {
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
            display: inline-block;
            height: 100%;
            width: 100%;
        }
    }
}
</style>