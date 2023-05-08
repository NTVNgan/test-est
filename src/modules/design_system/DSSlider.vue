<template>
    <div>
        <div>
            <h3 class="font-medium">Img Slider</h3>
            <button-comp @click="onShowImage">Show Image Slider</button-comp>
            <image-slider v-model="showImageSlider" ></image-slider>
        </div>
        <div>
            <slider height="264px">
                <div style="background: #5b8"></div>
                <div style="background: #85b"></div>
                <div style="background: #e95"></div>
                <div style="background: #e59"></div>
                <template #title> Title nè </template>
            </slider>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ButtonComp from '@/components/ui/ButtonComponent.vue';
import Slider from '@/components/ui/SliderComponent.vue';
import ImageSlider from '@/components/ui/ImageSliderComponent/ImageSliderComponent.vue';
export default defineComponent({
    name: 'DSSlider',
    components: {
        Slider,
        ImageSlider,
        ButtonComp,
    },
    setup() {
        const showImageSlider = ref(false);
        const randomIdImage = ref(null);
        const selectedIdImage = ref<any>(null);

        const onShowImage = () => {
            console.log('onshowimage')
            selectedIdImage.value = randomIdImage.value;
            showImageSlider.value = true;
        };

        return {
            selectedIdImage,
            randomIdImage,
            showImageSlider,
            onShowImage
        };
    },
});
</script>
