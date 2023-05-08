<template>
    <div class="w-88 bg-white py-16p px-8p">
        <router-link
            v-for="(item, index) in navLink"
            :key="`nav-${index}`"
            class="nav__item w-72 h-64 pt-8p pb-10p rounded-8p flex flex-col justify-around items-center transition duration-300 ease-in-out hover:bg-neutrals-50"
            :class="{ 'mt-8p': index > 0 }"
            active-class="bg-neutrals-50"
            :to="{ name: item.name }"
            v-slot="{ isExactActive, isActive }"
        >
            <icon-component
                :name="isExactActive || isActive ? `${item.icon}Solid` : item.icon"
                :color="isExactActive || isActive ? 'primary-500' : 'neutrals-700'"
            />
            <span
                class="text-12"
                :class="isExactActive || isActive ? 'text-primary-500 font-bold' : 'text-neutrals-300'"
            >
                {{ item.label }}
            </span>
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconComponent from './IconComponent.vue';
export default defineComponent({
    components: {
        IconComponent,
    },
    props: {
        navLink: {
            type: Array,
            default: () => [],
        },
    },
    setup() {
        return {};
    },
});
</script>

<style lang="scss" scoped>
.nav__item {
    &:hover {
        :deep(svg) {
            color: #3e6dda;
        }
        :deep(span) {
            color: #3e6dda;
        }
    }
}
</style>
