<template>
    <div class="dropzone-component">
        <Alert :type="'error'" nameIcon="ExclamationCircle" class="mb-16p" v-if="error" :close="false">
            <template v-slot:message>
                <p class="mt-2p"><slot name="messageError"></slot></p>
            </template>
        </Alert>
        <div
            class="dropzone-component-content relative text-center rounded"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
        >
            <input
                type="file"
                :name="name"
                :id="id"
                class="w-px h-px opacity-0 overflow-hidden absolute"
                @change="onChange"
                ref="file"
                :accept="accept"
                :multiple="multiple"
            />
            <template v-if="!modelValueSync || !modelValueSync.length">
                <div
                    class="dropzone-component__fileupload bg-white absolute flex flex-col items-center justify-center h-full w-full border border-dashed border-neutrals-200 rounded hover:border-primary-500 hover:shadow-inner-drop"
                >
                    <template v-if="isDrop">
                        <span class="text-16 text-primary-500 font-medium pointer-events-none"
                            >Drop files to upload</span
                        >
                    </template>
                    <template v-else>
                        <slot name="image"></slot>
                        <slot name="icon"></slot>
                        <label class="block cursor-pointer w-max mx-auto my-8p" :for="id">
                            <slot name="button"></slot>
                        </label>
                        <slot name="text"></slot>
                    </template>
                </div>
            </template>
            <template v-if="uploadType === 'image'">
                <template v-if="multiple">
                    <div class="dropzone-component-content__list-file" v-if="modelValueSync.length" v-cloak>
                        <div class="list-file__item" v-for="(image, key) in modelValueSync" :key="key">
                            <div class="list-file__item-group">
                                <div class="image">
                                    <img class="preview" :src="image" />
                                </div>
                                <button
                                    class="absolute top-8p right-8p btn-close"
                                    type="button"
                                    @click="remove(modelValueSync.indexOf(image))"
                                    title="Remove file"
                                >
                                    <icon-component :name="'Times'" color="#141417" />
                                </button>
                            </div>
                        </div>
                        <div class="list-file__add-file">
                            <label class="rounded cursor-pointer block" :for="id">
                                <div
                                    class="add-file__content border border-dashed border-neutrals-200 hover:border-primary-500 hover:shadow-inner-drop"
                                >
                                    <template v-if="isDrop">
                                        <div class="text">
                                            <span class="text-12 font-medium text-primary-500 block"
                                                >Drop files to upload</span
                                            >
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text">
                                            <span class="text-14 text-primary-500 block mb-8p">Add file</span>
                                            <span class="text-12 text-neutrals-500 block"
                                                >or drop files here to upload</span
                                            >
                                        </div>
                                    </template>
                                </div>
                            </label>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="list-file__item" v-if="modelValueSync">
                        <div class="list-file__item-single">
                            <div class="image">
                                <img :src="modelValueSync" class="m-auto" />
                            </div>
                            <button
                                class="absolute top-8p right-8p btn-close"
                                type="button"
                                @click="remove"
                                title="Remove file"
                            >
                                <icon-component :name="'Times'" color="#141417" />
                            </button>
                        </div>
                    </div>
                </template>
            </template>
            <template v-if="uploadType === 'file'">
                <div
                    class="bg-white flex items-center justify-center h-full w-full px-72p py-74p border border-dashed border-neutrals-200 rounded hover:border-primary-500 hover:shadow-inner-drop"
                    :class="{ 'file-item--drag': isDrop }"
                    v-if="modelValueSync"
                >
                    <div class="file-item relative h-72 w-368 flex items-center border border-neutrals-100 rounded">
                        <div class="flex items-center min-w-0 px-12p py-8p">
                            <svg
                                class="fill-current text-neutrals-200"
                                width="56"
                                height="56"
                                viewBox="0 0 56 56"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M43.2109 14.4219L36.0781 7.20312C35.3047 6.42969 34.1875 6 33.1562 6H15.625C13.3047 6 11.5 7.89062 11.5 10.125V45.875C11.5 48.1953 13.3047 50 15.625 50H40.375C42.6094 50 44.5 48.1953 44.5 45.875V17.3438C44.5 16.3125 43.9844 15.1953 43.2109 14.4219ZM41.3203 16.3984C41.4922 16.5703 41.5781 16.8281 41.6641 17H33.5V8.83594C33.6719 8.92188 33.9297 9.00781 34.1016 9.17969L41.3203 16.3984ZM40.375 47.25H15.625C14.8516 47.25 14.25 46.6484 14.25 45.875V10.125C14.25 9.4375 14.8516 8.75 15.625 8.75H30.75V17.6875C30.75 18.8906 31.6094 19.75 32.8125 19.75H41.75V45.875C41.75 46.6484 41.0625 47.25 40.375 47.25Z"
                                />
                            </svg>
                            <div class="text-left w-248 ml-8p">
                                <p class="file-item__name font-medium text-14 flex min-w-0">
                                    <span class="truncate">{{ fileUploadName }}</span>
                                    <span>{{ fileUploadFileType }}</span>
                                </p>
                                <p class="file-item__size text-12 text-neutrals-500 mt-4p">
                                    {{ infoFile ? filters.formatBytes(infoFile.size) : '' }}
                                </p>
                            </div>
                        </div>
                        <button
                            class="absolute top-8p right-8p file-item__delete-button btn-close"
                            type="button"
                            @click="remove"
                            title="Remove file"
                        >
                            <icon-component :name="'Times'" />
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import IconComponent from './IconComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';
import filters from '@/utils/filters';

export default defineComponent({
    name: 'Dropzone',
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: [String, Array],
        },
        accept: {
            type: String,
            default: '',
        },
        error: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: '',
        },
        uploadType: {
            type: String,
            default: 'image',
        },
        infoFile: {
            type: Object,
            default: null,
        },
    },
    components: {
        IconComponent,
        Alert,
    },
    emits: ['onChange', 'update:modelValue', 'closeAlert'],
    setup(props, { emit }) {
        const file = ref<any>(null),
            filelist = ref([]),
            imageSingle = ref({}),
            divs = ref([]),
            isDrop = ref(false);

        const modelValueSync = computed({
            get: () => props.modelValue,
            set: (value: any) => {
                return emit('update:modelValue', value);
            },
        });
        const fileUploadName = computed(() => {
            if (props.infoFile) {
                const findLastIndex = props.infoFile.name.toLowerCase().lastIndexOf('.');
                return props.infoFile.name.toLowerCase().slice(0, findLastIndex);
            }
            return '';
        });
        const fileUploadFileType = computed(() => {
            if (props.infoFile) {
                const findLastIndex = props.infoFile.name.toLowerCase().lastIndexOf('.');
                return props.infoFile.name.toLowerCase().slice(findLastIndex, props.infoFile.name.length);
            }
            return '';
        });

        const onChange = () => {
            if (props.multiple) {
                const input = file.value;
                emit('onChange', input);
            } else {
                const fileUpload = file.value.files[0];
                if (fileUpload) {
                    emit('onChange', fileUpload);
                }
            }
        };

        const remove = (i: any) => {
            if (props.multiple) {
                (modelValueSync as any).value.splice(i, 1);
            } else {
                file.value.value = null;
                (modelValueSync as any).value = '';
            }
        };

        const dragover = (event: any) => {
            event.preventDefault();
            // Add some visual fluff to show the user can drop its files
            if (!event.currentTarget.classList.contains('show-bg-drop')) {
                event.currentTarget.classList.remove('hide-bg-drop');
                event.currentTarget.classList.add('show-bg-drop');
                isDrop.value = true;
            }
        };
        const dragleave = (event: any) => {
            // Clean up
            event.currentTarget.classList.add('hide-bg-drop');
            event.currentTarget.classList.remove('show-bg-drop');
            isDrop.value = false;
        };

        const drop = (event: any) => {
            event.preventDefault();
            file.value.files = event.dataTransfer.files;
            onChange(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('hide-bg-drop');
            event.currentTarget.classList.remove('show-bg-drop');
            isDrop.value = false;
        };

        const closeAlert = () => {
            file.value.value = null;
            emit('closeAlert');
        };

        watch(
            () => props.modelValue,
            (newVal: any) => {
                if (newVal === '') {
                    file.value.value = null;
                }
            },
        );

        return {
            file,
            filelist,
            imageSingle,
            divs,
            modelValueSync,
            isDrop,
            onChange,
            remove,
            dragover,
            dragleave,
            drop,
            closeAlert,
            filters,
            fileUploadName,
            fileUploadFileType,
        };
    },
});
</script>

<style lang="scss">
[v-cloak] {
    display: none;
}
.dropzone-component {
    width: 100%;
    .alert {
        width: 100%;
    }
    &-content {
        min-height: 220px;
        &__list-file {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-gap: 8px;
            -webkit-user-select: none;
            user-select: none;
            .list-file {
                &__item {
                    &:first-child {
                        grid-column: 1 / span 2;
                        grid-row: 1 / span 2;
                    }
                    &-group {
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        background: #ffffff;
                        border-radius: 4px;
                        &:hover {
                            .btn-close {
                                visibility: visible;
                            }
                            .image::before {
                                visibility: visible;
                            }
                        }
                        .image {
                            z-index: 5;
                            display: flex;
                            overflow: hidden;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            border-radius: 5px;
                            transform: translateZ(0);
                            box-shadow: 0px 0px 0px 1px #e9e9ec inset;
                            img {
                                border-radius: 4px;
                                position: absolute;
                                z-index: 1;
                                max-height: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                            &::after {
                                content: '';
                                display: block;
                                width: 100%;
                                padding-bottom: 100%;
                            }
                            &::before {
                                content: '';
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                background: rgb(255 255 255 / 70%);
                                top: 0;
                                z-index: 2;
                                visibility: hidden;
                            }
                        }
                        .btn-close {
                            z-index: 5;
                            visibility: hidden;
                            outline: none;
                        }
                    }
                }
                &__add-file {
                    .add-file__content {
                        display: flex;
                        overflow: hidden;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        transform: translateZ(0);
                        border-radius: 4px;
                        background: #ffffff;
                        .text {
                            position: absolute;
                            padding: 0 8px;
                        }
                        &::after {
                            content: '';
                            display: block;
                            width: 100%;
                            padding-bottom: 100%;
                        }
                    }
                }
            }
        }
        .list-file__item {
            &-single {
                position: relative;
                background: #ffffff;
                &:hover {
                    .btn-close {
                        visibility: visible;
                    }
                    .image::before {
                        visibility: visible;
                    }
                }
                .image {
                    &::before {
                        content: '';
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        background: rgb(255 255 255 / 70%);
                        top: 0;
                        left: 0;
                        z-index: 2;
                        visibility: hidden;
                    }
                }
                .btn-close {
                    z-index: 5;
                    visibility: hidden;
                    outline: none;
                }
            }
        }
        .file-item--drag {
            background-color: #e2ecff;
            border-color: #3e6dda;
            box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 2px 20px rgba(0, 0, 0, 0.1);
            .file-item {
                border-color: #98b1eb;
                svg {
                    color: #98b1eb;
                }
                &__name {
                    color: #3e6dda;
                }
                &__size {
                    color: #98b1eb;
                }
                &__delete-button {
                    svg {
                        color: #3e6dda;
                    }
                }
            }
        }
        &.show-bg-drop {
            .dropzone-component {
                &__fileupload {
                    background-color: #e2ecff;
                    border-color: #3e6dda;
                }
                &-content {
                    &__list-file {
                        .list-file__add-file {
                            .add-file__content {
                                background-color: #e2ecff;
                                border-color: #3e6dda;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
