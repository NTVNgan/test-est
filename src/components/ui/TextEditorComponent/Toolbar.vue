<template>
    <div class="text-editor-comp">
        <div
            class="
                bg-neutrals-50
                text-14
                rounded-4p
                px-8p
                py-4p
                h-44
                flex
                items-center
                divide-x
                flex-wrap
                border-neutrals-200
                z-10
            "
        >
            <div class="mr-16p">
                <tooltip-component
                    class="inline-block"
                    type="dark"
                    position="top"
                    content="Text styles"
                    label="Tooltip"
                >
                    <new-dropdown-component v-model="showTextDropdown" :paddingRange="6" position="bottom-left">
                        <div
                            class="flex py-8p pl-16p rounded-4p w-178 justify-between hover:bg-neutrals-50 items-center"
                            :class="{ 'bg-neutrals-200 font-medium hover:bg-neutrals-200': showTextDropdown }"
                        >
                            <span>
                                <template v-if="dropdownFormatActive > 0">
                                    {{ `Heading ${dropdownFormatActive}` }}
                                </template>
                                <template v-else> Normal text </template>
                            </span>
                            <icon-component name="angle-down" />
                        </div>
                        <template #content>
                            <div class="p-8p w-178">
                                <div
                                    v-for="item in dropdownFormatGroup"
                                    class="py-8p px-12p font-semibold active:bg-primary-50 cursor-pointer"
                                    :class="{
                                        'bg-primary-50 hover:bg-primary-50': dropdownFormatActive == item.level,
                                        [item.style]: true,
                                    }"
                                    v-show="dropdownFormatActive != item.level"
                                    :key="item.level"
                                    @click="onClickFormatText(`h${item.level}`, true)"
                                >
                                    {{ item.name }}
                                </div>
                            </div>
                        </template>
                    </new-dropdown-component>
                </tooltip-component>
            </div>
            <div v-for="(item, index) in group" :key="index" class="flex items-center px-8p bg-neutrals-50">
                <tooltip-component
                    v-for="(childItem, indexChild) in item.child"
                    class="inline-block ml-8p"
                    type="dark"
                    position="top"
                    :content="childItem.tooltip"
                    :label="childItem.tooltip"
                    :key="indexChild"
                >
                    <label
                        v-if="childItem.name === 'image'"
                        for="upload-image-texteditor"
                        class="
                            w-36
                            h-36
                            flex
                            justify-center
                            items-center
                            cursor-pointer
                            rounded-4p
                            hover:bg-neutrals-100
                            active:bg-neutrals-500
                        "
                        :class="{
                            'bg-neutrals-500': childItem.active,
                            'bg-neutrals-50 text-neutrals-200 hover:bg-neutrals-50 pointer-events-none':
                                childItem.disabled,
                        }"
                    >
                        <icon-component
                            :name="childItem.name"
                            :color="activeItem === childItem.name ? 'white' : childItem.disabled ? 'neutrals-200' : ''"
                        />
                        <input
                            type="file"
                            class="w-px h-px opacity-0 overflow-hidden absolute"
                            id="upload-image-texteditor"
                            name="upload-image-texteditor"
                            accept=".png,.jpg,.jpeg"
                            multiple
                            @change="onUploadFile($event, 'image')"
                        />
                    </label>
                    <div
                        v-else
                        tabindex="1"
                        class="
                            w-36
                            h-36
                            flex
                            justify-center
                            items-center
                            cursor-pointer
                            rounded-4p
                            hover:bg-neutrals-100
                            active:bg-neutrals-500
                            focus:bg-neutrals-500
                        "
                        :class="{
                            'bg-neutrals-500 text-white hover:bg-neutrals-500': childItem.active,
                            'bg-neutrals-50 text-neutrals-200 hover:bg-neutrals-50 pointer-events-none':
                                childItem.disabled,
                        }"
                        @click="onClickFormatText(childItem.name)"
                        @mouseup="() => (activeItem = null)"
                        @mousedown="() => (activeItem = childItem.name)"
                    >
                        <icon-component :name="childItem.name" :color="activeItem === childItem.name ? 'white' : ''" />
                    </div>
                </tooltip-component>
            </div>
        </div>
        <div class="w-full bg-white h-60 absolute top-0 z-1-"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, onUnmounted } from 'vue';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';

export default defineComponent({
    name: 'Toolbar',
    components: {
        NewDropdownComponent,
        IconComponent,
        TooltipComponent,
    },
    props: ['editor'],
    emits: ['format', 'upload'],
    setup(props, { emit }) {
        const showTextDropdown = ref<boolean>(false);
        const activeItem = ref<string | null>(null);
        const onClickFormatText = (type: string, isDropdown = false) => {
            if (isDropdown) showTextDropdown.value = false;
            emit('format', { type });
        };
        const onUploadFile = (event: any, type: string) => {
            emit('upload', { files: event.target.files, type });
        };

        const mouseUpEvent = (e: any) => {
            activeItem.value = null;
        };

        onMounted(() => {
            document.addEventListener('mouseup', mouseUpEvent);
        });

        onUnmounted(() => {
            document.removeEventListener('mouseup', mouseUpEvent);
        });

        const dropdownFormatActive = computed(() => {
            const formatHeadingLevelList = [1, 2];
            let isActive = 0;

            props.editor &&
                formatHeadingLevelList.forEach((level: number) => {
                    if (props.editor.isActive('heading', { level })) isActive = level;
                });
            return isActive;
        });

        const dropdownFormatGroup = computed(() => [
            { name: 'Normal text', level: 0, style: '' },
            { name: 'Heading 1', level: 1, style: 'text-24 font-bold' },
            { name: 'Heading 2', level: 2, style: 'text-16 font-semibold' },
        ]);

        const group = computed(() => [
            {
                child: [
                    {
                        name: 'bold',
                        tooltip: 'Bold',
                        active: props.editor ? props.editor.isActive('bold') : null,
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                    {
                        name: 'italic',
                        tooltip: 'Italic',
                        active: props.editor ? props.editor.isActive('italic') : null,
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                    {
                        name: 'link',
                        tooltip: 'Link',
                        active: props.editor ? props.editor.isActive('link') : null,
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                ],
            },
            {
                child: [
                    {
                        name: 'align-left',
                        tooltip: 'Align left',
                        active: props.editor ? props.editor.isActive({ textAlign: 'left' }) && !props.editor.isActive({ textAlign: 'center' }) : null,
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                    {
                        name: 'align-center',
                        tooltip: 'Align center',
                        active: props.editor ? props.editor.isActive({ textAlign: 'center' }) : null,
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                ],
            },
            {
                child: [
                    {
                        name: 'list-ol',
                        tooltip: 'Numbered list',
                        active: props.editor ? props.editor.isActive('orderedList') : null,
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                    {
                        name: 'list-ul',
                        tooltip: 'Bullet list',
                        active: props.editor ? props.editor.isActive('bulletList') : null,
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                ],
            },
            {
                child: [
                    {
                        name: 'image',
                        tooltip: 'Image',
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                    {
                        name: 'code',
                        tooltip: 'Inline code',
                        active: props.editor ? props.editor.isActive('code') : null,
                        disabled: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                    {
                        name: 'code-block',
                        tooltip: 'Code block',
                        active: props.editor ? props.editor.isActive('codeBlock') : null,
                    },
                ],
            },
        ]);

        return {
            onClickFormatText,
            showTextDropdown,
            group,
            activeItem,
            dropdownFormatActive,
            dropdownFormatGroup,
            onUploadFile,
        };
    },
});
</script>

<style lang="scss" scoped></style>
