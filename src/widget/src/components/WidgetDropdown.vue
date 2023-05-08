<template>
    <span
        class="dropdown__title cursor-pointer"
        :class="classCustom"
        @click="showDropdown('click')"
        ref="dropdownParent"
        v-bind="$attrs"
        :style="[
            {
                borderRadius: borderRadius,
            },
        ]"
    >
        <slot></slot>
    </span>
    <teleport to="#select">
        <span
            v-if="modelValueSync"
            ref="dropdownChild"
            @click="clickInsideContent"
            v-click-outside-teleport="clickOutsideContent"
            @mouseenter="onHoverDropdownContent"
            class="dropdown__content"
            :style="[
                {
                    width: width !== '' ? width : 'max-content',
                    right: rightDropdown !== 'auto' ? `${rightDropdown}px` : rightDropdown,
                    left: leftDropdown !== 'auto' ? `${leftDropdown}px` : leftDropdown,
                    top: topDropdown !== 'auto' ? `${topDropdown}px` : topDropdown,
                    bottom: bottomDropdown !== 'auto' ? `${bottomDropdown}px` : bottomDropdown,
                    paddingTop: ['pos-top-bottom', 'pos-bottom'].includes(positionDropdown)
                        ? `${paddingRange}px`
                        : 'auto',
                    paddingBottom: ['pos-bottom-top', 'pos-top'].includes(positionDropdown)
                        ? `${paddingRange}px`
                        : 'auto',
                    paddingLeft: ['pos-left-right', 'pos-right'].includes(positionDropdown)
                        ? `${paddingRange}px`
                        : 'auto',
                    paddingRight: ['pos-right-left', 'pos-left'].includes(positionDropdown)
                        ? `${paddingRange}px`
                        : 'auto',
                },
            ]"
        >
            <span class="dropdown__inner">
                <span v-if="$slots.content" class="text-14">
                    <slot name="content"></slot>
                </span>
            </span>
        </span>
    </teleport>
</template>

<script>
import { defineComponent, computed, ref, nextTick, inject } from 'vue';
import filters from '@/utils/filters';

export default defineComponent({
    name: 'NewDropdownComponent',
    props: {
        position: {
            type: String,
            default: 'bottom',
        },
        width: {
            type: String,
            default: '',
        },
        modelValue: {
            type: Boolean,
            default: false,
        },
        showByClick: {
            type: Boolean,
            default: true,
        },
        showByTruncate: {
            type: Boolean,
            default: false,
        },
        showInListMessage: {
            type: Boolean,
            default: false,
        },
        classCustom: {
            type: String,
            default: '',
        },
        borderRadius: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        paddingRange: {
            type: Number,
            default: 4,
        },
    },
    setup(props, { emit }) {
        const dropdownParent = ref();
        const dropdownChild = ref();
        const rightDropdown = ref('auto');
        const leftDropdown = ref('auto');
        const topDropdown = ref('auto');
        const bottomDropdown = ref('auto');
        const isClickInsideContent = ref(false);
        const timeoutFunction = ref(null);
        const emitter = inject('emitter');
        const topBoxMessage = ref(0);
        const bottomBoxMessage = ref(0);

        const modelValueSync = computed({
            get() {
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            },
        });

        const checkPositionDropdown = computed(() => {
            if (dropdownChild.value && dropdownParent.value) {
                const rangeTopToScreen = dropdownParent.value.getBoundingClientRect().top;
                const rangeBottomToScreen = window.innerHeight - dropdownParent.value.getBoundingClientRect().bottom;
                const rangeRightToScreen = window.innerWidth - dropdownParent.value.getBoundingClientRect().right;
                const rangeLeftToScreen = dropdownParent.value.getBoundingClientRect().left;

                const dropdownWidth = dropdownChild.value.getBoundingClientRect().width;
                const dropdownHeight = dropdownChild.value.getBoundingClientRect().height;
                switch (props.position) {
                    case 'right':
                    case 'right-top':
                    case 'right-bottom':
                        return dropdownWidth > rangeRightToScreen;
                    case 'left':
                    case 'left-top':
                    case 'left-bottom':
                        return dropdownWidth > rangeLeftToScreen;
                    case 'top':
                    case 'top-left':
                    case 'top-right':
                        return dropdownHeight > rangeTopToScreen;
                    case 'bottom':
                    case 'bottom-left':
                    case 'bottom-right':
                        return dropdownHeight > rangeBottomToScreen;
                }
            }
            return false;
        });

        const checkContentDropdown = computed(() => {
            const content = {
                overflowLeft: false,
                overflowRight: false,
                overflowTop: false,
                overflowBottom: false,
            };
            if (dropdownChild.value && dropdownParent.value) {
                const dropdownWidth = dropdownChild.value.getBoundingClientRect().width;

                if (props.position === 'top' || props.position === 'bottom') {
                    const rangeRightToScreen =
                        window.innerWidth -
                        (dropdownParent.value.getBoundingClientRect().right - dropdownParent.value.offsetWidth / 2);
                    const rangeLeftToScreen =
                        dropdownParent.value.getBoundingClientRect().left + dropdownParent.value.offsetWidth / 2;
                    content.overflowLeft = dropdownWidth / 2 > rangeLeftToScreen;
                    content.overflowRight = dropdownWidth / 2 > rangeRightToScreen;
                }
                if (
                    props.position === 'top-left' ||
                    props.position === 'bottom-left' ||
                    props.position === 'top-right' ||
                    props.position === 'bottom-right'
                ) {
                    const rangeLeftToScreen =
                        window.innerWidth -
                        (dropdownParent.value.getBoundingClientRect().right - dropdownParent.value.offsetWidth);
                    const rangeRightToScreen =
                        dropdownParent.value.getBoundingClientRect().left + dropdownParent.value.offsetWidth;
                    content.overflowLeft = dropdownWidth > rangeLeftToScreen;
                    content.overflowRight = dropdownWidth > rangeRightToScreen;
                }
            }
            return content;
        });

        const positionDropdown = computed(() => {
            if (
                (props.position === 'top' || props.position === 'top-left' || props.position === 'top-right') &&
                !checkPositionDropdown.value
            ) {
                return 'pos-top';
            }
            if (
                (props.position === 'top' || props.position === 'top-left' || props.position === 'top-right') &&
                checkPositionDropdown.value
            ) {
                return 'pos-top-bottom';
            }
            if (
                (props.position === 'bottom' ||
                    props.position === 'bottom-left' ||
                    props.position === 'bottom-right') &&
                !checkPositionDropdown.value
            ) {
                return 'pos-bottom';
            }
            if (
                (props.position === 'bottom' ||
                    props.position === 'bottom-left' ||
                    props.position === 'bottom-right') &&
                checkPositionDropdown.value
            ) {
                return 'pos-bottom-top';
            }
            if (
                (props.position === 'left' || props.position === 'left-top' || props.position === 'left-bottom') &&
                !checkPositionDropdown.value
            ) {
                return 'pos-left';
            }
            if (
                (props.position === 'left' || props.position === 'left-top' || props.position === 'left-bottom') &&
                checkPositionDropdown.value
            ) {
                return 'pos-left-right';
            }
            if (
                (props.position === 'right' || props.position === 'right-top' || props.position === 'right-bottom') &&
                !checkPositionDropdown.value
            ) {
                return 'pos-right';
            }
            if (
                (props.position === 'right' || props.position === 'right-top' || props.position === 'right-bottom') &&
                checkPositionDropdown.value
            ) {
                return 'pos-right-left';
            }
            return '';
        });

        const checkTruncationText = () => {
            if (dropdownParent.value) {
                const truncateList = dropdownParent.value.getElementsByClassName('truncate');
                if (truncateList[0] == undefined) return '';
                return truncateList[0].scrollWidth > truncateList[0].clientWidth;
            }
            return false;
        };

        const getPositionParent = async () => {
            modelValueSync.value = true;
            let DropdownWidth = 0;
            let DropdownHeight = 0;
            let justifyY = 0;
            let justifyX = 0;
            await nextTick();
            if (dropdownChild.value && dropdownParent.value) {
                DropdownWidth = dropdownChild.value.offsetWidth;
                DropdownHeight = dropdownChild.value.offsetHeight;
                if (
                    (props.position === 'right' && !checkPositionDropdown.value) ||
                    (props.position === 'left' && checkPositionDropdown.value)
                ) {
                    rightDropdown.value = 'auto';
                    leftDropdown.value = dropdownParent.value.getBoundingClientRect().right;
                    justifyY = DropdownHeight / 2 - dropdownParent.value.getBoundingClientRect().height / 2;
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().top - justifyY;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'right-top' && !checkPositionDropdown.value) ||
                    (props.position === 'left-top' && checkPositionDropdown.value)
                ) {
                    rightDropdown.value = 'auto';
                    leftDropdown.value = dropdownParent.value.getBoundingClientRect().right;
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().top;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'right-bottom' && !checkPositionDropdown.value) ||
                    (props.position === 'left-bottom' && checkPositionDropdown.value)
                ) {
                    rightDropdown.value = 'auto';
                    leftDropdown.value = dropdownParent.value.getBoundingClientRect().right;
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().bottom - DropdownHeight;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'left' && !checkPositionDropdown.value) ||
                    (props.position === 'right' && checkPositionDropdown.value)
                ) {
                    rightDropdown.value = 'auto';
                    leftDropdown.value = dropdownParent.value.getBoundingClientRect().left - DropdownWidth;
                    justifyY = DropdownHeight / 2 - dropdownParent.value.getBoundingClientRect().height / 2;
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().top - justifyY;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'left-top' && !checkPositionDropdown.value) ||
                    (props.position === 'right-top' && checkPositionDropdown.value)
                ) {
                    rightDropdown.value = 'auto';
                    leftDropdown.value = dropdownParent.value.getBoundingClientRect().left - DropdownWidth;
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().top;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'left-bottom' && !checkPositionDropdown.value) ||
                    (props.position === 'right-bottom' && checkPositionDropdown.value)
                ) {
                    rightDropdown.value = 'auto';
                    leftDropdown.value = dropdownParent.value.getBoundingClientRect().left - DropdownWidth;
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().bottom - DropdownHeight;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'top' && !checkPositionDropdown.value) ||
                    (props.position === 'bottom' && checkPositionDropdown.value)
                ) {
                    if (checkContentDropdown.value.overflowLeft) {
                        leftDropdown.value = 4;
                    } else {
                        justifyX = DropdownWidth / 2 - dropdownParent.value.getBoundingClientRect().width / 2;
                        leftDropdown.value = dropdownParent.value.getBoundingClientRect().left - justifyX;
                    }
                    if (checkContentDropdown.value.overflowRight) {
                        rightDropdown.value = 4;
                        leftDropdown.value = 'auto';
                    } else {
                        rightDropdown.value = 'auto';
                    }
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().top - DropdownHeight;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'top-right' && !checkPositionDropdown.value) ||
                    (props.position === 'bottom-right' && checkPositionDropdown.value)
                ) {
                    if (checkContentDropdown.value.overflowRight) {
                        rightDropdown.value = 4;
                        leftDropdown.value = 'auto';
                    } else {
                        rightDropdown.value = 'auto';
                        leftDropdown.value = dropdownParent.value.getBoundingClientRect().left;
                    }
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().top - DropdownHeight;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'top-left' && !checkPositionDropdown.value) ||
                    (props.position === 'bottom-left' && checkPositionDropdown.value)
                ) {
                    // if (checkContentDropdown.value.overflowLeft) {
                    //     leftDropdown.value = 4;
                    //     rightDropdown.value = 'auto';
                    // } else {
                    //     rightDropdown.value = window.innerWidth - dropdownParent.value.getBoundingClientRect().right;
                    //     leftDropdown.value = 'auto';
                    // }
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().top - DropdownHeight;
                    bottomDropdown.value = 'auto';
                    rightDropdown.value = window.innerWidth - dropdownParent.value.getBoundingClientRect().right - 16;
                    leftDropdown.value = 'auto';
                }
                if (
                    (props.position === 'bottom' && !checkPositionDropdown.value) ||
                    (props.position === 'top' && checkPositionDropdown.value)
                ) {
                    if (checkContentDropdown.value.overflowRight) {
                        rightDropdown.value = 4;
                    } else {
                        rightDropdown.value = 'auto';
                    }
                    if (checkContentDropdown.value.overflowLeft) {
                        leftDropdown.value = 4;
                    } else {
                        justifyX = DropdownWidth / 2 - dropdownParent.value.getBoundingClientRect().width / 2;
                        leftDropdown.value = dropdownParent.value.getBoundingClientRect().left - justifyX;
                    }
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().bottom;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'bottom-right' && !checkPositionDropdown.value) ||
                    (props.position === 'top-right' && checkPositionDropdown.value)
                ) {
                    if (checkContentDropdown.value.overflowRight) {
                        rightDropdown.value = 4;
                        leftDropdown.value = 'auto';
                    } else {
                        rightDropdown.value = 'auto';
                        leftDropdown.value = dropdownParent.value.getBoundingClientRect().left;
                    }
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().bottom;
                    bottomDropdown.value = 'auto';
                }
                if (
                    (props.position === 'bottom-left' && !checkPositionDropdown.value) ||
                    (props.position === 'top-left' && checkPositionDropdown.value)
                ) {
                    if (checkContentDropdown.value.overflowRight) {
                        rightDropdown.value = 4;
                        leftDropdown.value = 'auto';
                    } else {
                        rightDropdown.value = window.innerWidth - dropdownParent.value.getBoundingClientRect().right;
                        leftDropdown.value = 'auto';
                    }
                    topDropdown.value = dropdownParent.value.getBoundingClientRect().bottom;
                    bottomDropdown.value = 'auto';
                }

                if (props.showInListMessage && document.getElementsByClassName('message-content').length > 0) {
                    topBoxMessage.value = document
                        .getElementsByClassName('message-content')[0]
                        .getBoundingClientRect().top;
                    bottomBoxMessage.value = document
                        .getElementsByClassName('message-content')[0]
                        .getBoundingClientRect().bottom;

                    if (
                        bottomBoxMessage.value - 14 < topDropdown.value ||
                        topBoxMessage.value + 14 > topDropdown.value
                    ) {
                        modelValueSync.value = false;
                    }
                }
            }
        };

        const hideDropdown = () => {
            if (!isClickInsideContent.value) {
                modelValueSync.value = false;
            }
        };

        const showDropdown = (action) => {
            if (!props.disabled) {
                if (!checkTruncationText() && props.showByTruncate) return;
                if (action === 'click' && modelValueSync.value) {
                    hideDropdown();
                } else if (action === 'click' && !modelValueSync.value && props.showByClick) {
                    getPositionParent();
                }
            }
        };

        const clickInsideContent = () => {
            isClickInsideContent.value = true;
        };

        const clickOutsideContent = () => {
            isClickInsideContent.value = false;
            modelValueSync.value = false;
        };

        // emitter.on('hideDropdown', () => {
        //     modelValueSync.value = false;
        // });

        return {
            modelValueSync,
            positionDropdown,
            checkPositionDropdown,
            checkContentDropdown,
            dropdownParent,
            dropdownChild,
            rightDropdown,
            leftDropdown,
            topDropdown,
            bottomDropdown,
            timeoutFunction,
            checkTruncationText,
            getPositionParent,
            showDropdown,
            hideDropdown,
            filters,
            clickInsideContent,
            clickOutsideContent,
        };
    },
});
</script>

<style lang="scss" scoped>
.dropdown {
    &__title{
        display: inherit;
    }
    &__content{
        position: fixed;
        z-index: 99999;
        display: block;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
    &__inner{
        box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        background-color: #fff;
        position: relative;
        display: block;
        overflow: hidden;
    }
}
</style>
