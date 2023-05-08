<template>
    <draggable
        v-bind="dragOptions"
        tag="div"
        :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null,
        }"
        class="item-container"
        :list="tasks"
        :group="{ name: 'g1' }"
        item-key="key"
        :move="checkMove"
    >
        <template #item="{ element }">
            <div class="item-group">
                <p>{{ element.name }}</p>
                <nested-draggable v-if="element.tasks" class="item-sub" :tasks="element.tasks" />
            </div>
        </template>
    </draggable>
</template>
<script lang="ts">
import draggable from 'vuedraggable';
import { ref, computed, onMounted } from 'vue';
export default {
    name: 'nested-draggable',
    props: {
        tasks: {
            required: true,
            type: Array,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        activeIndex: {
            type: [Number, Array],
            default: null,
        },
        activeKey: {
            type: Array,
            default: () => [],
        },
        lazy: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        draggable,
    },
    setup(props: any, { emit, slots }: any) {
        const drag = ref(false),
            d_activeIndex = ref(props.activeIndex);
        const tabs = ref<any[]>([]);

        const dragOptions = computed(() => {
            return {
                animation: 100,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            };
        });

        const checkMove = (e: any) => {
            if (e.draggedContext.element['tasks'] !== undefined && e.to.classList.contains('item-sub')) return false;
        };

        const activeKeySync = computed({
            get(): any {
                return props.activeKey;
            },
            set(value: any) {
                emit('update:activeKey', value);
            },
        });

        const getTabListFromSlot = () => {
            activeKeySync.value.forEach((child: any) => {
                (slots as any).default().filter((item: any) => {
                    if (item.props.key == child) {
                        tabs.value.push(item);
                    }
                });
            });
        };

        onMounted(() => {
            getTabListFromSlot();
        });

        return {
            dragOptions,
            checkMove,
            drag,
            d_activeIndex,
            tabs
        };
    },
};
</script>
<style scoped>
.item-container {
    max-width: 20rem;
    margin: 0;
}
.item {
    padding: 1rem;
    border: solid black 1px;
    background-color: #fefefe;
}
.item-sub {
    margin: 0 0 0 1rem;
}
</style>