<template>
    <div class="alert rounded py-12p px-16p border" :class="[classBg, classBorder]" v-if="showAlert">
        <div class="flex">
            <div class="flex-shrink-0">
                <icon-component :name="nameIcon" showClassText :color="colorIcon" />
            </div>
            <div class="content-alert ml-12p text-neutrals-900 text-left">
                <div v-if="$slots.title" class="text-16 mb-1 text-neutrals-900 font-medium">
                    <slot name="title"></slot>
                </div>
                <div v-if="$slots.message" class="text-14 mb-14p">
                    <slot name="message"></slot>
                </div>
                <div v-if="$slots.button">
                    <slot name="button"></slot>
                </div>
            </div>
            <div class="ml-auto pl-3" v-if="close">
                <div class="-mx-1.5 -my-1.5">
                    <button
                        type="button"
                        class="inline-flex bg-green-50 rounded-md p-1.5 text-neutrals-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                        @click="closeAlert"
                    >
                        <span class="sr-only">Dismiss</span>
                        <icon-component name="times" showClassText :color="colorIconClose" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'AlertComponent',
    props: {
        primary: {
            type: String,
            default: '',
        },
        secondary: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'default',
        },
        close: {
            type: Boolean,
            default: true,
        },
        nameIcon: {
            type: String,
            default: 'check-circle',
        },
        showAlert: {
            type: Boolean,
            default: true,
        },
    },
    components: { IconComponent },
    computed: {
        classBg(): string {
            return this.bgAlert(this.type);
        },
        classBorder(): string {
            return this.borderAlert(this.type);
        },
        colorIcon(): string {
            return this.colorIconAlert(this.type);
        },
        colorIconClose(): string {
            return this.colorIconCloseAlert(this.type);
        },
    },
    methods: {
        bgAlert(val: string) {
            switch (val) {
                case 'success':
                    return 'alert-success bg-success-5';
                case 'info':
                    return 'alert-info bg-primary-50';
                case 'warning':
                    return 'alert-warning bg-warning-5';
                case 'error':
                    return 'alert-error bg-error-5';
                default:
                    return 'alert-default bg-neutrals-50';
            }
        },
        borderAlert(val: string) {
            switch (val) {
                case 'success':
                    return 'border-success-6';
                case 'info':
                    return 'border-primary-200';
                case 'warning':
                    return 'border-warning-3';
                case 'error':
                    return 'border-error-6';
                default:
                    return 'border-neutrals-200';
            }
        },
        colorIconAlert(val: string) {
            switch (val) {
                case 'success':
                    return 'text-success-2';
                case 'info':
                    return 'text-primary-600';
                case 'warning':
                    return 'text-warning-3';
                case 'error':
                    return 'text-error-3';
                default:
                    return 'text-neutrals-600';
            }
        },
        colorIconCloseAlert(val: string) {
            switch (val) {
                case 'success':
                    return 'text-success-6';
                case 'info':
                    return 'text-primary-200';
                case 'warning':
                    return 'text-warning-3';
                case 'error':
                    return 'text-error-6';
                default:
                    return 'text-neutrals-200';
            }
        },
        closeAlert() {
            // this.showAlert = false;
            this.$emit('closeAlert');
        },
    },
});
</script>

<style lang="scss">
.alert {
    // width: 400px;
    .content-alert {
        > *:last-child {
            margin-bottom: 0;
        }
    }
    &-success{
        button{
            border-color: #98DAB2;
        }
    }
    &-warning{
        button{
            border-color: #FFB800;
        }
    }
    &-info{
        button{
            border-color: #98B1EB;
        }
    }
    &-error{
        button{
            border-color: #F29F8F;
        }
    }
}
.border-primary-200 {
    --border-opacity: 1;
    border-color: #98b1eb;
    border-color: rgba(152, 177, 235, var(--border-opacity));
}
.button-alert {
    color: #141417;
}
</style>
