<template>
    <div class="p-16p">
        <h4 class="mb-4p text-left">Default</h4>
        <Alert :primary="'Label'" :secondary="'Label'" :showAlert="true">
            <template v-slot:title>
                <h3>Default title</h3>
            </template>
            <template v-slot:message>
                <p>Body text.</p>
            </template>
            <template v-slot:button>
                <button-component
                    class="button-alert px-16p py-8p bg-primary-transparent rounded-4p border border-solid text-14 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    :disabled="false"
                    :size="'medium'"
                    :type="'outline'"
                    >Label
                </button-component>
                <button
                    type="button"
                    class="ml-3 rounded-4p text-14 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                    Label
                </button>
            </template>
        </Alert>
        <h4 class="mb-4p text-left mt-8p">Success</h4>
        <Alert
            :type="'success'"
            :primary="'Label'"
            :secondary="'Label'"
        >
            <template v-slot:title>
                <h3>Success title</h3>
            </template>
            <template v-slot:message>
                <p>Body text.</p>
            </template>
            <template v-slot:button>
                <button-component
                    class="button-alert px-16p py-8p bg-primary-transparent rounded-4p border border-solid text-14 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    :disabled="false"
                    :size="'medium'"
                    :type="'outline'"
                    >Label
                </button-component>
                <button
                    type="button"
                    class="ml-3 rounded-4p text-14 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                    Label
                </button>
            </template>
        </Alert>
        <h4 class="mb-4p text-left mt-8p">Warning</h4>
        <Alert
            :type="'warning'"
            :primary="'Label'"
            :secondary="'Label'"
        >
            <template v-slot:title>
                <h3>Warning title</h3>
            </template>
            <template v-slot:message>
                <p>Body text.</p>
            </template>
            <template v-slot:button>
                <button-component
                    class="button-alert px-16p py-8p bg-primary-transparent rounded-4p border border-solid text-14 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    :disabled="false"
                    :size="'medium'"
                    :type="'outline'"
                    >Label
                </button-component>
                <button
                    type="button"
                    class="ml-3 rounded-4p text-14 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                    Label
                </button>
            </template>
        </Alert>
        <h4 class="mb-4p text-left mt-8p">Info</h4>
        <Alert :type="'info'" :primary="'Label'" :secondary="'Label'">
            <template v-slot:title>
                <h3>Info title</h3>
            </template>
            <template v-slot:message>
                <p>Body text.</p>
            </template>
            <template v-slot:button>
                <button-component
                    class="button-alert px-16p py-8p bg-primary-transparent rounded-4p border border-solid text-14 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    :disabled="false"
                    :size="'medium'"
                    :type="'outline'"
                    >Label
                </button-component>
                <button
                    type="button"
                    class="ml-3 rounded-4p text-14 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                    Label
                </button>
            </template>
        </Alert>
        <h4 class="mb-4p text-left mt-8p">Error</h4>
        <Alert :type="'error'" :primary="'Label'" :secondary="'Label'">
            <template v-slot:title>
                <h3>Error title</h3>
            </template>
            <template v-slot:message>
                <p>Body text.</p>
            </template>
            <template v-slot:button>
                <button-component
                    class="button-alert px-16p py-8p bg-primary-transparent rounded-4p border border-solid text-14 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    :disabled="false"
                    :size="'medium'"
                    :type="'outline'"
                    >Label
                </button-component>
                <button
                    type="button"
                    class="ml-3 rounded-4p text-14 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                    Label
                </button>
            </template>
        </Alert>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Alert from '@/components/ui/AlertComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';

export default defineComponent({
    name: 'DSAlert',
    components: { Alert, ButtonComponent },
});
</script>

<style lang="scss">
.alert {
    width: 400px;
}
</style>
