<template>
    <div>
        <button-comp class="mr-10" size="medium" @click="() => (right = !right)">
            Right
        </button-comp>
        <button-comp class="mr-10" size="medium" @click="() => (left = !left)">
            Left
        </button-comp>
        <button-comp size="medium" @click="() => (cta = !cta)">
            With CTA
        </button-comp>
        <drawer-comp v-model="cta">
            <template v-slot:footer>
                <div class="flex justify-end ">
                    <button-comp type="subtle" class="mr-8p" size="medium">
                        Label
                    </button-comp>
                    <button-comp size="medium">
                        Label
                    </button-comp>
                </div>
            </template>
        </drawer-comp>
        <drawer-comp v-model="right"> </drawer-comp>
        <drawer-comp v-model="left" position="left"> </drawer-comp>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonComp from '@/components/ui/ButtonComponent.vue';
import DrawerComp from '@/components/ui/DrawerComponent.vue';

export default defineComponent({
    name: '',
    components: {
        ButtonComp,
        DrawerComp,
    },
    data() {
        return {
            right: false,
            left: false,
            cta: false,
        };
    },
});
</script>
