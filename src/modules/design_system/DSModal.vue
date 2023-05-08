<template>
    <div>
        <div class="flex justify-around">
            <button-comp size="medium" @click="() => (defaultType = !defaultType)">
                Default
            </button-comp>
            <button-comp size="medium" type="destructive" @click="() => (dangerType = !dangerType)">
                Danger
            </button-comp>
            <button-comp type="outline" size="medium" @click="() => (shortBodyType = !shortBodyType)">
                Short Body
            </button-comp>
            <button-comp type="outline" size="medium" @click="() => (longBodyType = !longBodyType)">
                Long Body
            </button-comp>
            <button-comp type="outline" size="medium" @click="() => (pictureType = !pictureType)">
                Multi buttons
            </button-comp>
            <button-comp type="outline" size="medium" @click="() => (pictureSingleType = !pictureSingleType)">
                Single buttons
            </button-comp>
        </div>

        <modal-component v-model="defaultType">
            <template v-slot:header>
                <div class="flex">
                    <icon-component class="mr-4p" name="InfoCircle" color="#3E6DDA" />
                    <span class="font-medium text-16"> Confirmation Modal Title</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="text-center text-14 px-32p">
                    Are you sure you want to deactivate your account? All of your data will be permanently removed. This
                    action cannot be undone.
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <button-comp type="secondary" class="mr-8p" size="medium">
                        Label
                    </button-comp>
                    <button-comp type="primary" size="medium">
                        Label
                    </button-comp>
                </div>
            </template>
        </modal-component>

        <modal-component v-model="dangerType">
            <template v-slot:header>
                <div class="flex">
                    <icon-component class="mr-4p" name="InfoCircle" color="#EC2B08" />
                    <span class="font-medium text-16"> Confirmation Modal Title</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="text-center text-14 px-32p">
                    Are you sure you want to deactivate your account? All of your data will be permanently removed. This
                    action cannot be undone.
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <button-comp type="secondary" class="mr-8p" size="medium">
                        Label
                    </button-comp>
                    <button-comp type="destructive" size="medium">
                        Label
                    </button-comp>
                </div>
            </template>
        </modal-component>

        <modal-component v-model="shortBodyType" :width="`600px`">
            <template v-slot:header>
                <div class="flex">
                    <span class="font-medium text-16">Title</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="text-14 px-32p">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus including versions of Lorem Ipsum. Contrary to popular belief, Lorem
                    Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,
                    making it over 2000 years old.
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <button-comp type="secondary" class="mr-8p" size="medium">
                        Label
                    </button-comp>
                    <button-comp size="medium">
                        Label
                    </button-comp>
                </div>
            </template>
        </modal-component>

        <modal-component v-model="longBodyType" :width="`600px`">
            <template v-slot:header>
                <div class="flex">
                    <span class="font-medium text-16">Title</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="text-14 overflow-y-scroll scroll pl-32p mr-8p pr-8p" style="max-height:400px">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus including versions of Lorem Ipsum. recently with desktop publishing
                    software like Aldus including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is
                    not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it
                    over 2000 years old. remaining essentially unchanged. It was popularised in the 1960s with the
                    release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus including versions of Lorem Ipsum. remaining essentially unchanged.
                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                    and more recently with desktop publishing software like Aldus including versions of Lorem Ipsum.
                    remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
                    containing Lorem Ipsum passages, and more recently with desktop Lorem Ipsum is simply dummy text of
                    the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
                    since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
                    like Aldus including versions of Lorem Ipsum. recently with desktop publishing software like Aldus
                    including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random
                    text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years
                    old. remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
                    sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
                    Aldus including versions of Lorem Ipsum. remaining essentially unchanged. It was popularised in the
                    1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
                    desktop publishing software like Aldus including versions of Lorem Ipsum. remaining essentially
                    unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                    Ipsum passages, and more recently with desktop
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <button-comp type="secondary" class="mr-8p" size="medium">
                        Label
                    </button-comp>
                    <button-comp size="medium">
                        Label
                    </button-comp>
                </div>
            </template>
        </modal-component>

        <modal-component v-model="pictureType">
            <template v-slot:body>
                <div class="flex flex-col items-center">
                    <img src="@/assets/images/sample.svg" alt="" />
                    <span class="font-bold text-24 mt-16p">Title</span>
                    <div class="text-14 px-88p text-center mt-16p">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry's standard dummy text ever since the 1500s
                    </div>
                    <div class="flex justify-end mt-16p">
                        <button-comp type="secondary" class="mr-8p" size="medium">
                            Label
                        </button-comp>
                        <button-comp size="medium">
                            Label
                        </button-comp>
                    </div>
                </div>
            </template>
        </modal-component>

        <modal-component v-model="pictureSingleType">
            <template v-slot:body>
                <div class="flex flex-col items-center">
                    <img src="@/assets/images/sample.svg" alt="" />
                    <span class="font-bold text-24 mt-16p">Title</span>
                    <div class="text-14 px-88p text-center mt-16p">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry's standard dummy text ever since the 1500s
                    </div>
                    <div class="flex justify-end mt-16p">
                        <button-comp size="medium">
                            Label
                        </button-comp>
                    </div>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComp from '@/components/ui/ButtonComponent.vue';
export default defineComponent({
    name: 'DSModal',
    data() {
        return {
            defaultType: false,
            dangerType: false,
            shortBodyType: false,
            longBodyType: false,
            pictureType: false,
            pictureSingleType: false,
        };
    },
    components: {
        ModalComponent,
        ButtonComp,
        IconComponent,
    },
    // setup() {
    //
    // },
});
</script>

<style lang="scss">
.scroll {
    &::-webkit-scrollbar {
        width: 16px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
        padding: 0 30px;
        width: 16px;
    }
    &::-webkit-scrollbar-thumb {
        background: transparent;

        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #b4b4be;
    }
    &:hover {
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
    }
}
</style>
