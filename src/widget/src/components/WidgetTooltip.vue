<template>
    <span
        class="tooltip__title"
        :class="classCustom"
        @click="showTooltip('click')"
        @mouseenter="showTooltip('hover')"
        @mouseleave="hideTooltip"
        ref="tooltipParent"
        v-bind="$attrs"
        :style="[
            {
                borderRadius: borderRadius,
            },
        ]"
    >
        <slot></slot>
    </span>
    <teleport to="#tooltip">
        <span
            v-if="isShowTooltip"
            ref="tooltipChild"
            @mouseenter="onHoverTooltipContent"
            @mouseleave="hideTooltip"
            class="tooltip__content max-w-320 break-words w-full fixed text-14 z-999 block text-left"
            :class="positionTooltip"
            :style="[
                {
                    width: width != '' ? width + 'px' : 'max-content',
                    right: rightTooltip !== 'auto' ? `${rightTooltip}px` : rightTooltip,
                    left: leftTooltip !== 'auto' ? `${leftTooltip}px` : leftTooltip,
                    top: topTooltip !== 'auto' ? `${topTooltip}px` : topTooltip,
                    bottom: bottomTooltip !== 'auto' ? `${bottomTooltip}px` : bottomTooltip,
                },
            ]"
        >
            <span :class="[sizeTooltip, typeTooltip]" class="tooltip__inner rounded relative block">
                <span v-if="$slots.content" class="text-14">
                    <slot name="content"></slot>
                </span>
                <span v-else>
                    {{ showTime ? filters.formatTime(content, false, true) : content }}
                </span>
                <span
                    ref="tooltipArrow"
                    class="tooltip__arrow fixed border-solid border-4"
                    :style="{
                        borderColor: borderColorArrow,
                        right: rightArrow !== 'auto' ? `${rightArrow}px` : rightArrow,
                        left: leftArrow !== 'auto' ? `${leftArrow}px` : leftArrow,
                        top: topArrow !== 'auto' ? `${topArrow}px` : topArrow,
                        bottom: bottomArrow !== 'auto' ? `${bottomArrow}px` : bottomArrow,
                    }"
                ></span></span
        ></span>
    </teleport>
</template>

<script>
import { defineComponent, computed, ref, nextTick, inject } from 'vue';
import filters from '@/utils/filters';

export default defineComponent({
    name: 'TooltipComponent',
    props: {
        size: {
            type: String,
            default: 'small',
        },
        type: {
            type: String,
            default: 'dark',
        },
        position: {
            type: String,
            default: 'bottom',
        },
        width: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
        timeout: {
            type: Number,
            default: 400,
        },
        showByClick: {
            type: Boolean,
            default: false,
        },
        showByTruncate: {
            type: Boolean,
            default: false,
        },
        showInListMessage: {
            type: Boolean,
            default: false,
        },
        showTime: {
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
    },
    setup(props) {
        const tooltipArrow = ref();
        const tooltipParent = ref();
        const tooltipChild = ref();
        const rightTooltip = ref('auto');
        const leftTooltip = ref('auto');
        const topTooltip = ref('auto');
        const bottomTooltip = ref('auto');
        const rightArrow = ref('auto');
        const leftArrow = ref('auto');
        const topArrow = ref('auto');
        const bottomArrow = ref('auto');
        const isShowTooltip = ref(false);
        const timeoutFunction = ref(null);
        const emitter = inject('emitter');
        const topBoxMessage = ref(0);
        const bottomBoxMessage = ref(0);

        const typeTooltip = computed(() => {
            const state = {
                'type-light bg-white text-neutrals-900': props.type === 'light',
                'type-black bg-neutrals-900 text-neutrals-50': props.type === 'dark',
            };

            return { ...state };
        });

        const sizeTooltip = computed(() => {
            const state = {
                'py-4p px-8p size-small': props.size === 'small',
                'py-12p px-16p size-large': props.size === 'large',
            };

            return { ...state };
        });

        const checkPositionTooltip = computed(() => {
            if (tooltipChild.value && tooltipParent.value) {
                const rangeTopToScreen = tooltipParent.value.getBoundingClientRect().top;
                const rangeBottomToScreen = window.innerHeight - tooltipParent.value.getBoundingClientRect().bottom;
                const rangeRightToScreen = document.documentElement.clientWidth - tooltipParent.value.getBoundingClientRect().right;
                const rangeLeftToScreen = tooltipParent.value.getBoundingClientRect().left;

                const tooltipWidth = tooltipChild.value.getBoundingClientRect().width;
                const tooltipHeight = tooltipChild.value.getBoundingClientRect().height;
                switch (props.position) {
                    case 'right':
                    case 'right-top':
                    case 'right-bottom':
                        return tooltipWidth > rangeRightToScreen;
                    case 'left':
                    case 'left-top':
                    case 'left-bottom':
                        return tooltipWidth > rangeLeftToScreen;
                    case 'top':
                    case 'top-left':
                    case 'top-right':
                        return tooltipHeight > rangeTopToScreen;
                    case 'bottom':
                    case 'bottom-left':
                    case 'bottom-right':
                        return tooltipHeight > rangeBottomToScreen;
                }
            }
            return false;
        });

        const checkContentTooltip = computed(() => {
            const content = {
                overflowLeft: false,
                overflowRight: false,
                overflowTop: false,
                overflowBottom: false,
            };
            if (tooltipChild.value && tooltipParent.value) {
                const tooltipWidth = tooltipChild.value.getBoundingClientRect().width;

                if (props.position === 'top' || props.position === 'bottom') {
                    const rangeRightToScreen =
                        document.documentElement.clientWidth -
                        (tooltipParent.value.getBoundingClientRect().right - tooltipParent.value.offsetWidth / 2);
                    const rangeLeftToScreen =
                        tooltipParent.value.getBoundingClientRect().left + tooltipParent.value.offsetWidth / 2;
                    content.overflowLeft = tooltipWidth / 2 > rangeLeftToScreen;
                    content.overflowRight = tooltipWidth / 2 > rangeRightToScreen;
                }
                if (
                    props.position === 'top-left' ||
                    props.position === 'bottom-left' ||
                    props.position === 'top-right' ||
                    props.position === 'bottom-right'
                ) {
                    const rangeRightToScreen =
                        document.documentElement.clientWidth -
                        (tooltipParent.value.getBoundingClientRect().right - tooltipParent.value.offsetWidth);
                    const rangeLeftToScreen =
                        tooltipParent.value.getBoundingClientRect().left + tooltipParent.value.offsetWidth;
                    content.overflowLeft = tooltipWidth > rangeLeftToScreen;
                    content.overflowRight = tooltipWidth > rangeRightToScreen;
                }
            }
            return content;
        });

        const positionTooltip = computed(() => {
            const state = {
                'pos-top pb-10p':
                    (props.position === 'top' || props.position === 'top-left' || props.position === 'top-right') &&
                    !checkPositionTooltip.value,
                'pos-top-bottom pt-10p':
                    (props.position === 'top' || props.position === 'top-left' || props.position === 'top-right') &&
                    checkPositionTooltip.value,
                'pos-bottom pt-10p':
                    (props.position === 'bottom' ||
                        props.position === 'bottom-left' ||
                        props.position === 'bottom-right') &&
                    !checkPositionTooltip.value,
                'pos-bottom-top pb-10p':
                    (props.position === 'bottom' ||
                        props.position === 'bottom-left' ||
                        props.position === 'bottom-right') &&
                    checkPositionTooltip.value,
                'pos-left pr-10p':
                    (props.position === 'left' || props.position === 'left-top' || props.position === 'left-bottom') &&
                    !checkPositionTooltip.value,
                'pos-left-right pl-10p':
                    (props.position === 'left' || props.position === 'left-top' || props.position === 'left-bottom') &&
                    checkPositionTooltip.value,
                'pos-right pl-10p':
                    (props.position === 'right' ||
                        props.position === 'right-top' ||
                        props.position === 'right-bottom') &&
                    !checkPositionTooltip.value,
                'pos-right-left pr-10p':
                    (props.position === 'right' ||
                        props.position === 'right-top' ||
                        props.position === 'right-bottom') &&
                    checkPositionTooltip.value,
            };

            return { ...state };
        });

        const borderColorArrow = computed(() => {
            const color = props.type === 'dark' ? '#141417' : '#ffffff';
            switch (props.position) {
                case 'right':
                case 'right-top':
                case 'right-bottom':
                    return !checkPositionTooltip.value
                        ? 'transparent ' + color + ' transparent transparent'
                        : 'transparent transparent transparent ' + color;
                case 'left':
                case 'left-top':
                case 'left-bottom':
                    return !checkPositionTooltip.value
                        ? 'transparent transparent transparent ' + color
                        : 'transparent ' + color + ' transparent transparent';
                case 'top':
                case 'top-left':
                case 'top-right':
                    return !checkPositionTooltip.value
                        ? color + ' transparent transparent transparent'
                        : 'transparent transparent ' + color + ' transparent';
                case 'bottom':
                case 'bottom-left':
                case 'bottom-right':
                    return !checkPositionTooltip.value
                        ? 'transparent transparent ' + color + ' transparent'
                        : color + ' transparent transparent transparent';
            }
            return '';
        });

        const checkTruncationText = () => {
            if (tooltipParent.value) {
                const truncateList = tooltipParent.value.getElementsByClassName('truncate');
                if (truncateList[0] == undefined) return '';
                return truncateList[0].scrollWidth > truncateList[0].clientWidth;
            }
            return false;
        };

        const getPositionArrrow = async () => {
            let ArrowWidth = 0;
            let ArrowHeight = 0;
            let justifyY = 0;
            let justifyX = 0;
            if (tooltipArrow.value && tooltipParent.value && tooltipChild.value) {
                ArrowWidth = tooltipArrow.value.offsetWidth;
                ArrowHeight = tooltipArrow.value.offsetHeight;
                if (
                    (props.position === 'right' && !checkPositionTooltip.value) ||
                    (props.position === 'left' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    leftArrow.value =
                        props.size === 'small'
                            ? tooltipParent.value.getBoundingClientRect().right + 2
                            : tooltipParent.value.getBoundingClientRect().right;
                    justifyY = ArrowHeight / 2 - tooltipParent.value.getBoundingClientRect().height / 2;
                    topArrow.value = tooltipParent.value.getBoundingClientRect().top - justifyY;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'right-top' && !checkPositionTooltip.value) ||
                    (props.position === 'left-top' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    leftArrow.value =
                        props.size === 'small'
                            ? tooltipParent.value.getBoundingClientRect().right + 2
                            : tooltipParent.value.getBoundingClientRect().right;
                    topArrow.value = tooltipParent.value.getBoundingClientRect().top + 8;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'right-bottom' && !checkPositionTooltip.value) ||
                    (props.position === 'left-bottom' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    leftArrow.value =
                        props.size === 'small'
                            ? tooltipParent.value.getBoundingClientRect().right + 2
                            : tooltipParent.value.getBoundingClientRect().right;
                    topArrow.value = tooltipParent.value.getBoundingClientRect().bottom - 16;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'left' && !checkPositionTooltip.value) ||
                    (props.position === 'right' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    leftArrow.value = tooltipParent.value.getBoundingClientRect().left - 10;
                    justifyY = ArrowHeight / 2 - tooltipParent.value.getBoundingClientRect().height / 2;
                    topArrow.value = tooltipParent.value.getBoundingClientRect().top - justifyY;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'left-top' && !checkPositionTooltip.value) ||
                    (props.position === 'right-top' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    leftArrow.value = tooltipParent.value.getBoundingClientRect().left - 10;
                    topArrow.value = tooltipParent.value.getBoundingClientRect().top + 8;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'left-bottom' && !checkPositionTooltip.value) ||
                    (props.position === 'right-bottom' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    leftArrow.value = tooltipParent.value.getBoundingClientRect().left - 10;
                    topArrow.value = tooltipParent.value.getBoundingClientRect().bottom - 16;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'top' && !checkPositionTooltip.value) ||
                    (props.position === 'bottom' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    justifyX = ArrowWidth / 2 - tooltipParent.value.getBoundingClientRect().width / 2;
                    leftArrow.value = tooltipParent.value.getBoundingClientRect().left - justifyX;
                    topArrow.value = tooltipParent.value.getBoundingClientRect().top - 10;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'top-left' && !checkPositionTooltip.value) ||
                    (props.position === 'bottom-left' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    leftArrow.value = tooltipParent.value.getBoundingClientRect().left + 8;
                    topArrow.value = tooltipParent.value.getBoundingClientRect().top - 10;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'top-right' && !checkPositionTooltip.value) ||
                    (props.position === 'bottom-right' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = document.documentElement.clientWidth - tooltipParent.value.getBoundingClientRect().right + 8;
                    leftArrow.value = 'auto';
                    topArrow.value = tooltipParent.value.getBoundingClientRect().top - 10;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'bottom' && !checkPositionTooltip.value) ||
                    (props.position === 'top' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    justifyX = ArrowWidth / 2 - tooltipParent.value.getBoundingClientRect().width / 2;
                    leftArrow.value = tooltipParent.value.getBoundingClientRect().left - justifyX;
                    topArrow.value =
                        props.size === 'small'
                            ? tooltipParent.value.getBoundingClientRect().bottom + 2
                            : tooltipParent.value.getBoundingClientRect().bottom;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'bottom-left' && !checkPositionTooltip.value) ||
                    (props.position === 'top-left' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = 'auto';
                    leftArrow.value = tooltipParent.value.getBoundingClientRect().left + 8;
                    topArrow.value =
                        props.size === 'small'
                            ? tooltipParent.value.getBoundingClientRect().bottom + 2
                            : tooltipParent.value.getBoundingClientRect().bottom;
                    bottomArrow.value = 'auto';
                }
                if (
                    (props.position === 'bottom-right' && !checkPositionTooltip.value) ||
                    (props.position === 'top-right' && checkPositionTooltip.value)
                ) {
                    rightArrow.value = document.documentElement.clientWidth - tooltipParent.value.getBoundingClientRect().right + 8;
                    leftArrow.value = 'auto';
                    topArrow.value =
                        props.size === 'small'
                            ? tooltipParent.value.getBoundingClientRect().bottom + 2
                            : tooltipParent.value.getBoundingClientRect().bottom;
                    bottomArrow.value = 'auto';
                }
            }
        };

        const getPositionParent = async () => {
            isShowTooltip.value = true;
            let TooltipWidth = 0;
            let TooltipHeight = 0;
            let justifyY = 0;
            let justifyX = 0;
            await nextTick();
            if (tooltipChild.value && tooltipParent.value) {
                TooltipWidth = tooltipChild.value.offsetWidth;
                TooltipHeight = tooltipChild.value.offsetHeight;
                if (
                    (props.position === 'right' && !checkPositionTooltip.value) ||
                    (props.position === 'left' && checkPositionTooltip.value)
                ) {
                    rightTooltip.value = 'auto';
                    leftTooltip.value = tooltipParent.value.getBoundingClientRect().right;
                    justifyY = TooltipHeight / 2 - tooltipParent.value.getBoundingClientRect().height / 2;
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().top - justifyY;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'right-top' && !checkPositionTooltip.value) ||
                    (props.position === 'left-top' && checkPositionTooltip.value)
                ) {
                    rightTooltip.value = 'auto';
                    leftTooltip.value = tooltipParent.value.getBoundingClientRect().right;
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().top;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'right-bottom' && !checkPositionTooltip.value) ||
                    (props.position === 'left-bottom' && checkPositionTooltip.value)
                ) {
                    rightTooltip.value = 'auto';
                    leftTooltip.value = tooltipParent.value.getBoundingClientRect().right;
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().bottom - TooltipHeight;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'left' && !checkPositionTooltip.value) ||
                    (props.position === 'right' && checkPositionTooltip.value)
                ) {
                    rightTooltip.value = 'auto';
                    leftTooltip.value = tooltipParent.value.getBoundingClientRect().left - TooltipWidth;
                    justifyY = TooltipHeight / 2 - tooltipParent.value.getBoundingClientRect().height / 2;
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().top - justifyY;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'left-top' && !checkPositionTooltip.value) ||
                    (props.position === 'right-top' && checkPositionTooltip.value)
                ) {
                    rightTooltip.value = 'auto';
                    leftTooltip.value = tooltipParent.value.getBoundingClientRect().left - TooltipWidth;
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().top;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'left-bottom' && !checkPositionTooltip.value) ||
                    (props.position === 'right-bottom' && checkPositionTooltip.value)
                ) {
                    rightTooltip.value = 'auto';
                    leftTooltip.value = tooltipParent.value.getBoundingClientRect().left - TooltipWidth;
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().bottom - TooltipHeight;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'top' && !checkPositionTooltip.value) ||
                    (props.position === 'bottom' && checkPositionTooltip.value)
                ) {
                    if (checkContentTooltip.value.overflowLeft) {
                        leftTooltip.value = 4;
                    } else {
                        justifyX = TooltipWidth / 2 - tooltipParent.value.getBoundingClientRect().width / 2;
                        leftTooltip.value = tooltipParent.value.getBoundingClientRect().left - justifyX;
                    }
                    if (checkContentTooltip.value.overflowRight) {
                        rightTooltip.value = 4;
                        leftTooltip.value = 'auto';
                    } else {
                        rightTooltip.value = 'auto';
                    }
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().top - TooltipHeight;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'top-left' && !checkPositionTooltip.value) ||
                    (props.position === 'bottom-left' && checkPositionTooltip.value)
                ) {
                    if (checkContentTooltip.value.overflowRight) {
                        rightTooltip.value = 4;
                        leftTooltip.value = 'auto';
                    } else {
                        rightTooltip.value = 'auto';
                        leftTooltip.value = tooltipParent.value.getBoundingClientRect().left;
                    }
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().top - TooltipHeight;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'top-right' && !checkPositionTooltip.value) ||
                    (props.position === 'bottom-right' && checkPositionTooltip.value)
                ) {
                    if (checkContentTooltip.value.overflowLeft) {
                        leftTooltip.value = 4;
                        rightTooltip.value = 'auto';
                    } else {
                        console.log(2, document.documentElement.clientWidth, tooltipParent.value.getBoundingClientRect());
                        rightTooltip.value = document.documentElement.clientWidth - tooltipParent.value.getBoundingClientRect().right;
                        leftTooltip.value = 'auto';
                    }
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().top - TooltipHeight;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'bottom' && !checkPositionTooltip.value) ||
                    (props.position === 'top' && checkPositionTooltip.value)
                ) {
                    if (checkContentTooltip.value.overflowRight) {
                        rightTooltip.value = 4;
                    } else {
                        rightTooltip.value = 'auto';
                    }
                    if (checkContentTooltip.value.overflowLeft) {
                        leftTooltip.value = 4;
                    } else {
                        justifyX = TooltipWidth / 2 - tooltipParent.value.getBoundingClientRect().width / 2;
                        leftTooltip.value = tooltipParent.value.getBoundingClientRect().left - justifyX;
                    }
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().bottom;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'bottom-left' && !checkPositionTooltip.value) ||
                    (props.position === 'top-left' && checkPositionTooltip.value)
                ) {
                    if (checkContentTooltip.value.overflowRight) {
                        rightTooltip.value = 4;
                        leftTooltip.value = 'auto';
                    } else {
                        rightTooltip.value = 'auto';
                        leftTooltip.value = tooltipParent.value.getBoundingClientRect().left;
                    }
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().bottom;
                    bottomTooltip.value = 'auto';
                }
                if (
                    (props.position === 'bottom-right' && !checkPositionTooltip.value) ||
                    (props.position === 'top-right' && checkPositionTooltip.value)
                ) {
                    if (checkContentTooltip.value.overflowLeft) {
                        leftTooltip.value = 4;
                        rightTooltip.value = 'auto';
                    } else {
                        rightTooltip.value = document.documentElement.clientWidth - tooltipParent.value.getBoundingClientRect().right;
                        leftTooltip.value = 'auto';
                    }
                    topTooltip.value = tooltipParent.value.getBoundingClientRect().bottom;
                    bottomTooltip.value = 'auto';
                }

                if (props.showInListMessage && document.getElementsByClassName('message-content').length > 0) {
                    topBoxMessage.value = document
                        .getElementsByClassName('message-content')[0]
                        .getBoundingClientRect().top;
                    bottomBoxMessage.value = document
                        .getElementsByClassName('message-content')[0]
                        .getBoundingClientRect().bottom;

                    if (bottomBoxMessage.value - 14 < topTooltip.value || topBoxMessage.value + 14 > topTooltip.value) {
                        isShowTooltip.value = false;
                    }
                }
            }
            getPositionArrrow();
        };

        const hideTooltip = () => {
            if (props.timeout > 0) {
                clearTimeout(timeoutFunction.value);
            }
            isShowTooltip.value = false;
        };

        const showTooltip = (action) => {
            if (!checkTruncationText() && props.showByTruncate) return;
            if (action === 'hover' && !props.showByClick) {
                if (props.timeout === null) {
                    getPositionParent();
                }
                if (props.timeout > 0) {
                    timeoutFunction.value = setTimeout(() => {
                        getPositionParent();
                    }, props.timeout);
                }
            }
            if (action === 'click' && props.showByClick) {
                if (props.timeout === null) {
                    getPositionParent();
                }
                if (props.timeout > 0) {
                    timeoutFunction.value = setTimeout(() => {
                        getPositionParent();
                    }, props.timeout);
                }
            }
            if (action === 'click' && !props.showByClick) {
                hideTooltip();
            }
        };

        const onHoverTooltipContent = () => {
            if (props.timeout > 0) {
                clearTimeout(timeoutFunction.value);
            }
            isShowTooltip.value = true;
        };

        emitter.on('hideTooltip', () => {
            isShowTooltip.value = false;
        });

        return {
            isShowTooltip,
            typeTooltip,
            sizeTooltip,
            positionTooltip,
            tooltipArrow,
            checkPositionTooltip,
            borderColorArrow,
            checkContentTooltip,
            tooltipParent,
            tooltipChild,
            rightArrow,
            leftArrow,
            topArrow,
            bottomArrow,
            rightTooltip,
            leftTooltip,
            topTooltip,
            bottomTooltip,
            timeoutFunction,
            checkTruncationText,
            getPositionParent,
            showTooltip,
            hideTooltip,
            filters,
            onHoverTooltipContent,
        };
    },
});
</script>

<style lang="scss" scoped>
.tooltip {
    &__title{
        display: inherit;
    }
    &__content{
        font-family: 'Roboto';
        position: fixed;
        z-index: 99999;
        display: block;
        word-wrap: break-word;
        overflow-wrap: break-word;
        padding-bottom: 10px;
        >span{
            font-weight: normal;
            font-size: 14px;
            line-height: 20px;
            color: #ffffff;
            display: block;
            position: relative;
        }
        .type-black{
            background: #141417;
            border-radius: 4px;
            padding: 4px 8px;
            
        }
        .tooltip__arrow{
            position: fixed;
            border-width: 4px;
            border-style: solid;
        }
    }
}
.tooltip__inner {
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.15);
}
</style>
