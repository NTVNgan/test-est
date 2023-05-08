<template>
    <div class="p-12p">
        <div class="grid grid-flow-col mb-16p">
            <div class="type">
                <label
                    for="type"
                    class="block text-sm font-semibold text-gray-700 mb-4p text-center"
                >Type</label>
                <select
                    v-model="type"
                    id="type"
                    name="type"
                    class="m-auto mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option :value="'default'">Default</option>
                    <option :value="'disable'">Disable</option>
                </select>
            </div>
        </div>
        <div class="grid grid-flow-col grid-cols-2 mb-16p">
            <div class="border-r-2 text-center">
                <label for="type" class="block text-sm font-bold text-gray-700 mb-12p">Icon</label>
                <div class="group-tag mb-12p">
                    <Dropdown :disabled="type == 'disable'" v-click-outside="closeOption">
                        <template v-slot:header>
                            <div
                                @click="open = !open"
                                class="group-focus:border-primary-500 label bg-white h-36 text-neutrals-900 pl-12p pr-4p outline-none flex items-center justify-between rounded border border-neutrals-200 hover:border-primary-500"
                            >
                                <div class="flex items-center">
                                    <icon-component
                                        class="mr-8p"
                                        name="globe"
                                        :color="type == 'disable' ? 'neutrals-300' : 'neutrals-900'"
                                    />Select
                                </div>
                                <icon-component
                                    name="angle-down"
                                    :color="type == 'disable' ? 'neutrals-300' : 'neutrals-900'"
                                />
                            </div>
                        </template>
                        <template v-slot:list>
                            <div
                                class="list p-8p dropdown-list w-full origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                role="none"
                                v-if="open"
                            >
                                <span
                                    class="uppercase block px-12p py-8p text-12 font-medium text-primary-500"
                                >File option</span>
                                <a
                                    :href="option.link"
                                    class="flex items-center outline-none item block px-12p py-8p text-14 text-neutrals-900 rounded border border-primary-transparent hover:bg-neutrals-50"
                                    role="menuitem"
                                    v-for="(option, i) of optionActionIcon"
                                    :key="i"
                                    @click="open = false"
                                >
                                    <icon-component
                                        v-if="option.icon"
                                        class="mr-12p"
                                        :name="option.icon"
                                        color="#6b6b7b"
                                    />
                                    {{ option.label }}
                                </a>
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>
            <div class="text-center">
                <label for="type" class="block text-sm font-bold text-gray-700 mb-12p">No Icon</label>
                <div class="group-tag mb-12p">
                    <Dropdown :disabled="type == 'disable'" v-click-outside="closeOptionNoIcon">
                        <template v-slot:header>
                            <div
                                @click="openOption = !openOption"
                                class="group-focus:border-primary-500 label bg-white h-36 text-neutrals-900 pl-12p pr-4p outline-none flex items-center justify-between rounded border border-neutrals-200 hover:border-primary-500"
                            >
                                <div class="flex items-center">Select</div>
                                <icon-component
                                    name="angle-down"
                                    :color="type == 'disable' ? 'neutrals-300' : 'neutrals-900'"
                                />
                            </div>
                        </template>
                        <template v-slot:list>
                            <div
                                class="list p-8p dropdown-list w-full origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                role="none"
                                v-if="openOption"
                            >
                                <span
                                    class="uppercase block px-12p py-8p text-12 font-medium text-primary-500"
                                >File option</span>
                                <a
                                    :href="option.link"
                                    class="flex items-center outline-none item block px-12p py-8p text-14 text-neutrals-900 rounded border border-primary-transparent hover:bg-neutrals-50"
                                    role="menuitem"
                                    v-for="(option, i) of optionAction"
                                    :key="i"
                                    @click="openOption = false"
                                >
                                    <icon-component
                                        v-if="option.icon"
                                        class="mr-12p"
                                        :name="option.icon"
                                        color="#6b6b7b"
                                    />
                                    {{ option.label }}
                                </a>
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dropdown from '@/components/ui/DropdownComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'Dropdown component',
    components: { Dropdown, IconComponent },
    data() {
        return {
            optionActionIcon: [
                { label: 'Account settings', link: '#', icon: 'Clone' },
                { label: 'Support', link: '#', icon: 'Clone' },
                { label: 'License', link: '#', icon: 'Clone' },
                { label: 'License', link: '#', icon: 'Clone' },
                { label: 'License', link: '#', icon: 'Clone' },
                { label: 'License', link: '#', icon: 'Clone' },
            ],
            optionAction: [
                { label: 'Account settings', link: '#' },
                { label: 'Support', link: '#' },
                { label: 'License', link: '#' },
                { label: 'License', link: '#' },
                { label: 'License', link: '#' },
                { label: 'License', link: '#' },
            ],
            type: 'default',
            isError: false,
            open: false,
            openOption: false,
        };
    },
    methods: {
        closeOption() {
            this.open = false;
        },
        closeOptionNoIcon() {
            this.openOption = false;
        },
    },
});
</script>

<style lang="scss">
.dropdown-component {
    min-width: 180px;
    width: 100%;
    max-width: 200px;
    .label {
        &:hover {
            box-shadow: 0 0 0 2px rgb(62 109 218 / 20%);
        }
        &.error {
            border-color: #ec2b08;
            box-shadow: 0 0 0 2px rgb(236 43 8 / 30%);
        }
    }
    .disabled {
        .label {
            border-color: #e9e9ec;
            background-color: #f6f6f8;
            color: #9b9ba8;
            cursor: not-allowed;
            &:hover {
                box-shadow: none;
            }
        }
    }
    .content-dropdow{
        width: 100%;
    }
    .dropdown-list {
        overflow: hidden;
        top: 40px;
        left: 0;
        right: 0;
        z-index: 1;
    }
    .list {
        height: 160px;
        overflow-y: auto;
        scrollbar-color: #e9e9ec #f6f6f8;
        &::-webkit-scrollbar {
            width: 16px;
        }

        &::-webkit-scrollbar-track {
            background: #f6f6f8;
            padding: 0 30px;
            width: 16px;
        }

        &::-webkit-scrollbar-thumb {
            background: #e9e9ec;
            border-radius: 8px;
            border: 4px solid #f6f6f8;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: #b4b4be;
        }
        .item {
            &:active {
                background-color: #e2ecff;
                color: #141417;
                path {
                    fill: #141417;
                }
            }
        }
    }
}
</style>
