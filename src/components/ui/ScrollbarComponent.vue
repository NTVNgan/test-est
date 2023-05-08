<template>
    <div ref="scrollbar" class="scrollbar">
        <div class="scrollbar__wrapper">
            <div ref="content" class="scrollbar__content" @scroll="moveBar" @mouseenter="moveBar">
                <slot></slot>
            </div>
        </div>
        <div ref="xBar" class="scrollbar__bar scrollbar__bar-x" @mousedown="onXBarMouseDown"></div>
        <div ref="yBar" class="scrollbar__bar scrollbar__bar-y" @mousedown="onYBarMouseDown"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, onUpdated, nextTick, inject } from 'vue';
import { addClass, removeClass, getHeight } from '@/utils/dom-handler';

export default defineComponent({
    name: 'ScrollbarComponent',
    setup() {
        const initialized = ref<boolean>(false);
        const documentResizeListener = ref<any>(null);
        const documentMouseMoveListener = ref<any>(null);
        const documentMouseUpListener = ref<any>(null);
        const frame = ref<any>(null);
        const scrollXRatio = ref<any>(null);
        const scrollYRatio = ref<any>(null);
        const isXBarClicked = ref<boolean>(false);
        const isYBarClicked = ref<boolean>(false);
        const lastPageX = ref<any>(null);
        const lastPageY = ref<any>(null);
        const scrollbar = ref<HTMLElement>();
        const content = ref<HTMLElement>();
        const xBar = ref<HTMLElement>();
        const yBar = ref<HTMLElement>();
        const emitter: any = inject('emitter');

        const requestAnimationFrame = (f: any) => {
            const frame = window.requestAnimationFrame;
            return frame(f);
        };
        const unbindDocumentMouseListeners = () => {
            if (documentMouseMoveListener.value) {
                document.removeEventListener('mousemove', documentMouseMoveListener.value);
                documentMouseMoveListener.value = null;
            }
            if (documentMouseUpListener.value) {
                document.removeEventListener('mouseup', documentMouseUpListener.value);
                documentMouseUpListener.value = null;
            }
        };
        const onDocumentMouseUp = () => {
            removeClass(yBar.value, 'scrollbar__grabbed');
            removeClass(xBar.value, 'scrollbar__grabbed');
            removeClass(document.body, 'scrollbar__grabbed');
            unbindDocumentMouseListeners();
            isXBarClicked.value = false;
            isYBarClicked.value = false;
        };
        const onMouseMoveForXBar = (e: any) => {
            const deltaX = e.pageX - lastPageX.value;
            lastPageX.value = e.pageX;
            frame.value = requestAnimationFrame(() => {
                if (content.value) {
                    content.value.scrollLeft += deltaX / scrollXRatio.value;
                }
            });
        };
        const onMouseMoveForYBar = (e: any) => {
            const deltaY = e.pageY - lastPageY.value;
            lastPageY.value = e.pageY;
            frame.value = requestAnimationFrame(() => {
                if (content.value) {
                    content.value.scrollTop += deltaY / scrollYRatio.value;
                }
            });
        };
        const onDocumentMouseMove = (e: any) => {
            if (isXBarClicked.value) {
                onMouseMoveForXBar(e);
            } else if (isYBarClicked.value) {
                onMouseMoveForYBar(e);
            } else {
                onMouseMoveForXBar(e);
                onMouseMoveForYBar(e);
            }
        };
        const moveBar = async () => {
            await nextTick();
            if (scrollbar.value && content.value && xBar.value && yBar.value) {
                /* horizontal scroll */
                const totalWidth = content.value.scrollWidth;
                const ownWidth = content.value.clientWidth;
                const bottom = (scrollbar.value?.clientHeight - xBar.value.clientHeight) * -1;
                scrollXRatio.value = ownWidth / totalWidth;
                /* vertical scroll */
                const totalHeight = content.value.scrollHeight;
                const ownHeight = content.value.clientHeight;
                const right = (scrollbar.value?.clientWidth - yBar.value.clientWidth) * -1;
                scrollYRatio.value = ownHeight / totalHeight;
                frame.value = requestAnimationFrame(() => {
                    if (scrollXRatio.value >= 1) {
                        addClass(xBar.value, 'scrollbar__hidden');
                    } else {
                        removeClass(xBar.value, 'scrollbar__hidden');
                        if (xBar.value && content.value) {
                            xBar.value.style.cssText =
                                'width: calc(' +
                                Math.max(scrollXRatio.value * 100, 10) +
                                '% - 8px); left:' +
                                (content.value.scrollLeft / totalWidth) * 100 +
                                '%;bottom:' +
                                (bottom + 4) +
                                'px;';
                        }
                    }
                    if (scrollYRatio.value >= 1) {
                        addClass(yBar.value, 'scrollbar__hidden');
                    } else {
                        removeClass(yBar.value, 'scrollbar__hidden');
                        if (xBar.value && yBar.value && content.value) {
                            yBar.value.style.cssText =
                                'height: calc(' +
                                Math.max(scrollYRatio.value * 100, 10) +
                                '% - 8px); top: calc(' +
                                (content.value.scrollTop / totalHeight) * 100 +
                                '% - ' +
                                xBar.value.clientHeight +
                                'px);right:' +
                                (right + 4) +
                                'px;';
                        }
                    }
                });
            }
        };
        const bindDocumentMouseListeners = () => {
            if (!documentMouseMoveListener.value) {
                documentMouseMoveListener.value = (e: any) => {
                    onDocumentMouseMove(e);
                };
                document.addEventListener('mousemove', documentMouseMoveListener.value);
            }
            if (!documentMouseUpListener.value) {
                documentMouseUpListener.value = (e: any) => {
                    onDocumentMouseUp();
                };
                document.addEventListener('mouseup', documentMouseUpListener.value);
            }
        };
        const bindDocumentResizeListener = () => {
            if (!documentResizeListener.value) {
                documentResizeListener.value = () => {
                    moveBar();
                };
                window.addEventListener('resize', documentResizeListener.value);
            }
        };
        const unbindDocumentResizeListener = () => {
            if (documentResizeListener.value) {
                window.removeEventListener('resize', documentResizeListener.value);
                documentResizeListener.value = null;
            }
        };
        const calculateContainerHeight = async () => {
            await nextTick();
            if (scrollbar.value && content.value && xBar.value) {
                const containerStyles: any = getComputedStyle(scrollbar.value),
                    xBarStyles = getComputedStyle(xBar.value),
                    pureContainerHeight = getHeight(scrollbar.value) - parseInt(xBarStyles['height'], 10);
                if (containerStyles['max-height'] !== 'none' && pureContainerHeight === 0) {
                    if (
                        content.value.offsetHeight + parseInt(xBarStyles['height'], 10) >
                        parseInt(containerStyles['max-height'], 10)
                    ) {
                        scrollbar.value.style.height = containerStyles['max-height'];
                    } else {
                        scrollbar.value.style.height =
                            content.value.offsetHeight +
                            parseFloat(containerStyles.paddingTop) +
                            parseFloat(containerStyles.paddingBottom) +
                            parseFloat(containerStyles.borderTopWidth) +
                            parseFloat(containerStyles.borderBottomWidth) +
                            'px';
                    }
                }
            }
        };
        const onYBarMouseDown = (e: any) => {
            isYBarClicked.value = true;
            lastPageY.value = e.pageY;
            addClass(yBar.value, 'scrollbar__grabbed');
            addClass(document.body, 'scrollbar__grabbed');
            bindDocumentMouseListeners();
            e.preventDefault();
        };
        const onXBarMouseDown = (e: any) => {
            isXBarClicked.value = true;
            lastPageX.value = e.pageX;
            addClass(xBar.value, 'scrollbar__grabbed');
            addClass(document.body, 'scrollbar__grabbed');
            bindDocumentMouseListeners();
            e.preventDefault();
        };
        const initialize = async () => {
            await moveBar();
            await calculateContainerHeight();
            bindDocumentResizeListener();
        };

        onMounted(() => {
            emitter.on('scrollbarResize', initialize);
            if (scrollbar.value?.offsetParent) {
                initialize();
            }
        });
        onUpdated(() => {
            if (!initialized.value && scrollbar.value?.offsetParent) {
                initialize();
            }
        });
        onUnmounted(() => {
            emitter.off('scrollbarResize', initialize);
            unbindDocumentResizeListener();
            if (frame.value) {
                window.cancelAnimationFrame(frame.value);
            }
        });

        return {
            scrollbar,
            content,
            xBar,
            yBar,
            initialized,
            documentResizeListener,
            documentMouseMoveListener,
            documentMouseUpListener,
            frame,
            scrollXRatio,
            scrollYRatio,
            isXBarClicked,
            isYBarClicked,
            lastPageX,
            lastPageY,
            onYBarMouseDown,
            onXBarMouseDown,
            moveBar,
        };
    },
});
</script>

<style lang="scss">
.scrollbar__wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    float: left;
}
.scrollbar__content {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: scroll;
    box-sizing: border-box;
    &::-webkit-scrollbar {
        width: 0;
    }
    &::-webkit-scrollbar-track {
        padding: 0px;
        width: 0;
    }
}
.scrollbar__bar {
    position: relative;
    background: #b4b4be;
    border-radius: 4px;
    z-index: 2;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.25s linear;
}
.scrollbar__bar-y {
    width: 8px;
    top: 0;
    margin: 4px 0;
}
.scrollbar__bar-x {
    height: 8px;
    bottom: 0;
    margin: 0 4px;
}
.scrollbar__hidden {
    visibility: hidden;
}
.scrollbar:hover .scrollbar__bar,
.scrollbar:active .scrollbar__bar {
    opacity: 1;
}
.scrollbar__grabbed {
    user-select: none;
}
</style>
