<template>
    <div>
        <h4 class="mb-4p text-center">Default</h4>
        <div class="ds-checkbox grid grid-flow-col grid-cols-3 mb-16p">
            <div class="border-r-2">
                <ListGroup showSearch heightList="160px" class="m-auto" v-model="valueSelect2" placeholderSearch="Search">
                    <template #title>Choose attribute to show</template>
                    <list-item value="1">Hintonburg</list-item>
                    <list-item value="2">Westboro</list-item>
                    <list-item value="3" :disabled="true">Downtown</list-item>
                    <list-item value="4" nameIcon="clone">Richmond Hill</list-item>
                    <list-item value="5" :disabled="true" nameIcon="clone">Richmond Hill</list-item>
                </ListGroup>
            </div>
            <div class="border-r-2">
                <ListGroup
                    showSearch
                    v-model="valueSelect"
                    typeSearch="decription"
                    heightList="160px"
                    class="m-auto"
                    placeholderSearch="Search"
                >
                    <template #title>Choose attribute to show</template>
                    <list-item type="default-blue" value="1">
                        Hintonburg
                        <template #decription>Description</template>
                    </list-item>
                    <list-item type="default-blue" value="2">
                        Westboro
                        <template #decription>Description</template>
                    </list-item>
                    <list-item type="default-blue" value="3">
                        Downtown
                        <template #decription>Description</template>
                    </list-item>
                    <list-item type="default-blue" value="4" :disabled="true">
                        Richmond Hill
                        <template #decription>Description</template>
                    </list-item>
                </ListGroup>
            </div>
            <div>
                <list-group class="m-auto" showSearch v-model="valueSelect1" placeholderSearch="Search">
                    <template #title>Choose attribute to show</template>
                    <list-item type="avatar" value="11">
                        <template #avatar>
                            <avatar-component
                                :labelShow="false"
                                size="xs"
                                labelAvatar="Active"
                                :bgAvatar="'bg-avatar-2'"
                            />
                        </template>Active
                    </list-item>
                    <list-item type="avatar" value="22">
                        <template #avatar>
                            <avatar-component
                                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                                :labelShow="false"
                                size="xs"
                                labelAvatar="Bctive"
                            />
                        </template>Bctive
                    </list-item>
                    <list-item type="avatar" value="33" :disabled="true">
                        <template #avatar>
                            <avatar-component
                                :labelShow="false"
                                size="xs"
                                labelAvatar="Active"
                                :bgAvatar="'bg-avatar-2'"
                            />
                        </template>Active
                    </list-item>
                </list-group>
            </div>
        </div>
        <h4 class="mb-4p text-center">Checkbox</h4>
        <div class="ds-checkbox grid grid-flow-col grid-cols-2 mb-16p">
            <div class="border-r-2">
                <list-group
                    typeList="checkbox"
                    class="mt-20p m-auto"
                    v-model="selectedCategories1"
                    heightList="160px"
                >
                    <template #decription>LOCATION OPTIONS</template>
                    <list-item type="checkbox">
                        <CheckBoxCustom value="11" name="1112">
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item>
                    <list-item type="checkbox">
                        <CheckBoxCustom value="21" name="1112">
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item>
                    <list-item type="checkbox">
                        <CheckBoxCustom value="213" name="1112">
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item>
                    <list-item type="checkbox">
                        <CheckBoxCustom value="31" name="1112">
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item>
                    <list-item type="checkbox">
                        <CheckBoxCustom value="4" name="1112">
                            <template #title>title</template>
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item>
                </list-group>
            </div>
            <div>
                <list-group
                    typeList="checkbox"
                    class="mt-20p m-auto"
                    showSearch
                    selectAll
                    v-model="selectedCategories2"
                    @change="onChange"
                    placeholderSearch="Search"
                    heightList="220px"
                >
                    <template #title>Choose attribute to show</template>
                    <!-- <list-item type="checkbox">
                        <CheckBoxCustom value="11" name="111">
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item>
                    <list-item type="checkbox">
                        <CheckBoxCustom value="333" name="111">
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item>
                    <list-item type="checkbox">
                        <CheckBoxCustom value="21" name="111">
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item>
                    <list-item type="checkbox">
                        <CheckBoxCustom value="213" name="111" :disabled="true">
                            <template v-slot:label>i have a bike</template>
                        </CheckBoxCustom>
                    </list-item> -->
                    <list-item type="checkbox" v-for="(item, index) in generalAttributes" :key="index">
                        <CheckBoxCustom :value="item._id" name="attribute" :disabled="item.disabled">
                            <template v-slot:title>{{ item.name }}</template>
                            <template v-slot:label>{{ item.name }}</template>
                        </CheckBoxCustom>
                    </list-item>
                </list-group>
            </div>
        </div>
        <h4 class="mb-4p text-center">Radio</h4>
        <div class="ds-checkbox grid grid-flow-col mb-16p">
            <list-group
                typeList="radio"
                class="mt-20p m-auto"
                v-model="selectedCategories3"
                heightList="160px"
            >
                <list-item type="radio" :disabled="true">
                    <Radio valueRadio="66" nameRadio="groupRadio1">
                        <template v-slot:label>Contains</template>
                    </Radio>
                </list-item>
                <list-item type="radio">
                    <Radio valueRadio="11" nameRadio="groupRadio1">
                        <template v-slot:label>Contains</template>
                    </Radio>
                </list-item>
                <list-item type="radio">
                    <Radio valueRadio="22" nameRadio="groupRadio1">
                        <template v-slot:label>Does not contain</template>
                    </Radio>
                </list-item>
                <list-item type="radio">
                    <Radio valueRadio="33" nameRadio="groupRadio1">
                        <template v-slot:label>Label</template>
                        <template v-slot:custom>
                            <Input
                                class="w-300"
                                :state="'default'"
                                :type="'text'"
                                placeholder="Enter value"
                            ></Input>
                        </template>
                    </Radio>
                </list-item>
                <list-item type="radio">
                    <Radio valueRadio="44" nameRadio="groupRadio1">
                        <template v-slot:label>Does not contain</template>
                    </Radio>
                </list-item>
                <list-item type="radio">
                    <Radio valueRadio="55" nameRadio="groupRadio1">
                        <template v-slot:label>Does not contain</template>
                    </Radio>
                </list-item>
                <template v-slot:button>
                    <button-component :size="'medium'" :type="'primary'">
                        <span>Label</span>
                    </button-component>
                </template>
            </list-group>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import ListGroup from '@/components/ui/ListComponent.vue';
import ListItem from '@/components/ui/ListItemComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import CheckBoxCustom from '@/components/ui/CheckboxCustom.vue';
import Radio from '@/components/ui/RadioButtonComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import Input from '@/components/ui/InputComponent.vue';

export default defineComponent({
    name: 'DSList',
    components: {
        ListGroup,
        ListItem,
        AvatarComponent,
        CheckBoxCustom,
        Radio,
        ButtonComponent,
        Input,
    },
    setup() {
        const valueSingle = ref<boolean>(false);
        const checkedNames = ref<object[]>([]);
        const valueSelect = ref<any>('1');
        const valueSelect1 = ref<string>('11');
        const valueSelect2 = ref<string>();
        const selectedCategories1 = ref<any>(['31']);
        const selectedCategories2 = ref<any>([]);
        const picked1 = ref<string>();
        const selectedCategories3 = ref<string>('33');

        const generalAttributes = [
            // { name: 'Full name', _id: 'name', disabled: true },
            // { name: 'Email', _id: 'email', disabled: true },
            { name: 'Phone', _id: 'phone' },
            { name: 'Country', _id: 'country' },
            { name: 'Sign up', _id: 'signed_up' },
            { name: 'Last seen', _id: 'last_seen' },
            { name: 'Local', _id: 'timezone' },
            { name: 'City', _id: 'city' },
            { name: 'Customer ID', _id: 'id' },
            { name: 'Browser language', _id: 'browser_language' },
        ];

        const onChange = (val: any) => {
            console.log(val);
        }

        return {
            valueSingle,
            checkedNames,
            valueSelect,
            valueSelect1,
            valueSelect2,
            selectedCategories1,
            selectedCategories2,
            picked1,
            selectedCategories3,
            onChange,
            generalAttributes
        };
    },
});
</script>

<style lang="scss" scoped>
.list-component {
    width: 224px;
    &__radio {
        width: 368px;
    }
}
</style>