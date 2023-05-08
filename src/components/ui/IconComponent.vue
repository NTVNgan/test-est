<template>
    <i :class="classBase">
        <component class="icon-svg fill-current" :is="iconName" :class="classColor"> </component>
    </i>
</template>
<script lang="ts">
import { defineComponent, computed, defineAsyncComponent, ref, onMounted, onUpdated } from 'vue';
import InboxSolid from '@/components/icons/InboxSolid.vue';
import PersonSolid from '@/components/icons/PersonSolid.vue';
import BookSolid from '@/components/icons/BookSolid.vue';
import ChartSolid from '@/components/icons/ChartSolid.vue';
import PaperPlantSolid from '@/components/icons/PaperPlantSolid.vue';
import CogSolid from '@/components/icons/CogSolid.vue';
import Times from '@/components/icons/Times.vue';
import Wifi from '@/components/icons/Wifi.vue';
import WifiSlash from '@/components/icons/WifiSlash.vue';
import SortAsc from '@/components/icons/SortAsc.vue';
import SortDesc from '@/components/icons/SortDesc.vue';
import Ellipsis from '@/components/icons/Ellipsis.vue';
import EllipsisH from '@/components/icons/EllipsisH.vue';
import Ban from '@/components/icons/Ban.vue';
import Archive from '@/components/icons/Archive.vue';
import Bell from '@/components/icons/Bell.vue';
import BellSolid from '@/components/icons/BellSolid.vue';
import Emoji from '@/components/icons/Emoji.vue';
import Clock from '@/components/icons/Clock.vue';
import VolumeUp from '@/components/icons/VolumeUp.vue';
import SignOut from '@/components/icons/SignOut.vue';
import ExternalLink from '@/components/icons/ExternalLink.vue';
import BookAlt from '@/components/icons/BookAlt.vue';
import Undo from '@/components/icons/Undo.vue';
export default defineComponent({
    name: 'IconComponent',
    props: {
        type: {
            type: String,
            default: '',
        },
        name: {
            type: String,
        },
        color: {
            type: String,
            default: 'black',
        },
        showClassText: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        EyeSlash: defineAsyncComponent(() =>
            import('@/components/icons/EyeSlash.vue' /* webpackChunkName: "eyeslash" */),
        ),
        AlignCenter: defineAsyncComponent(() =>
            import('@/components/icons/AlignCenter.vue' /* webpackChunkName: "AlignCenter" */),
        ),
        AlignLeft: defineAsyncComponent(() =>
            import('@/components/icons/AlignLeft.vue' /* webpackChunkName: "AlignLeft" */),
        ),
        Bold: defineAsyncComponent(() =>
            import('@/components/icons/Bold.vue' /* webpackChunkName: "Bold" */),
        ),
        Italic: defineAsyncComponent(() =>
            import('@/components/icons/Italic.vue' /* webpackChunkName: "Italic" */),
        ),
        Code: defineAsyncComponent(() =>
            import('@/components/icons/Code.vue' /* webpackChunkName: "Code" */),
        ),
        UndoAlt: defineAsyncComponent(() =>
            import('@/components/icons/UndoAlt.vue' /* webpackChunkName: "UndoAlt" */),
        ),
        CodeBlock: defineAsyncComponent(() =>
            import('@/components/icons/CodeBlock.vue' /* webpackChunkName: "CodeBlock" */),
        ),
        Link: defineAsyncComponent(() =>
            import('@/components/icons/Link.vue' /* webpackChunkName: "Link" */),
        ),
        ListOl: defineAsyncComponent(() =>
            import('@/components/icons/ListOl.vue' /* webpackChunkName: "ListOl" */),
        ),
        ListUl: defineAsyncComponent(() =>
            import('@/components/icons/ListUl.vue' /* webpackChunkName: "ListUl" */),
        ),
        Eye: defineAsyncComponent(() => import('@/components/icons/Eye.vue' /* webpackChunkName: "eye" */)),
        Person: defineAsyncComponent(() => import('@/components/icons/Person.vue' /* webpackChunkName: "person" */)),
        Image: defineAsyncComponent(() => import('@/components/icons/Image.vue' /* webpackChunkName: "image" */)),
        ImageLight: defineAsyncComponent(() =>
            import('@/components/icons/ImageLight.vue' /* webpackChunkName: "ImageLight" */),
        ),
        ChevronRightRegular: defineAsyncComponent(
            () => import('@/components/icons/ChevronRightRegular.vue' /* webpackChunkName: "chevronrightRegular" */),
        ),
        ChevronLeftRegular: defineAsyncComponent(
            () => import('@/components/icons/ChevronLeftRegular.vue' /* webpackChunkName: "chevronleftRegular" */),
        ),
        ChevronRight: defineAsyncComponent(
            () => import('@/components/icons/ChevronRight.vue' /* webpackChunkName: "chevronright" */),
        ),
        ChevronUp: defineAsyncComponent(() =>
            import('@/components/icons/ChevronUp.vue' /* webpackChunkName: "ChevronUp" */),
        ),
        ChevronDown: defineAsyncComponent(() =>
            import('@/components/icons/ChevronDown.vue' /* webpackChunkName: "chevrondown" */),
        ),
        ChevronLeft: defineAsyncComponent(() =>
            import('@/components/icons/ChevronLeft.vue' /* webpackChunkName: "chevronleft" */),
        ),
        Globe: defineAsyncComponent(() => import('@/components/icons/Globe.vue' /* webpackChunkName: "eyeglobe" */)),
        Folders: defineAsyncComponent(() => import('@/components/icons/Folders.vue' /* webpackChunkName: "folders" */)),
        ExclamationCircle: defineAsyncComponent(() =>
            import('@/components/icons/ExclamationCircle.vue' /* webpackChunkName: "exlamationcircle" */),
        ),
        Tips: defineAsyncComponent(() => import('@/components/icons/Tips.vue' /* webpackChunkName: "tips" */)),
        Clone: defineAsyncComponent(() => import('@/components/icons/Clone.vue' /* webpackChunkName: "clone" */)),
        CheckCircle: defineAsyncComponent(() =>
            import('@/components/icons/CheckCircle.vue' /* webpackChunkName: "checkcircle" */),
        ),
        CheckCircleWhite: defineAsyncComponent(() =>
            import('@/components/icons/CheckCircleWhite.vue' /* webpackChunkName: "checkcircle" */),
        ),
        CaretUp: defineAsyncComponent(() => import('@/components/icons/CaretUp.vue' /* webpackChunkName: "caretup" */)),
        CaretDown: defineAsyncComponent(() =>
            import('@/components/icons/CaretDown.vue' /* webpackChunkName: "caretdown" */),
        ),
        Search: defineAsyncComponent(() => import('@/components/icons/Search.vue' /* webpackChunkName: "search" */)),
        AngleDown: defineAsyncComponent(() =>
            import('@/components/icons/AngleDown.vue' /* webpackChunkName: "angledown" */),
        ),
        AngleRight: defineAsyncComponent(() =>
            import('@/components/icons/AngleRight.vue' /* webpackChunkName: "angleright" */),
        ),
        AngleLeft: defineAsyncComponent(() =>
            import('@/components/icons/AngleLeft.vue' /* webpackChunkName: "angleleft" */),
        ),
        Inbox: defineAsyncComponent(() => import('@/components/icons/Inbox.vue' /* webpackChunkName: "inbox" */)),
        InboxIn: defineAsyncComponent(() => import('@/components/icons/InboxIn.vue' /* webpackChunkName: "InboxIn" */)),
        LongArrowLeft: defineAsyncComponent(() =>
            import('@/components/icons/LongArrowLeft.vue' /* webpackChunkName: "longarrowleft" */),
        ),
        LongArrowRight: defineAsyncComponent(() =>
            import('@/components/icons/LongArrowRight.vue' /* webpackChunkName: "longarrowright" */),
        ),
        LongArrowDown: defineAsyncComponent(() =>
            import('@/components/icons/LongArrowDown.vue' /* webpackChunkName: "longarrowDown" */),
        ),
        LongArrowUp: defineAsyncComponent(() =>
            import('@/components/icons/LongArrowUp.vue' /* webpackChunkName: "longarrowUp" */),
        ),
        Trash: defineAsyncComponent(() => import('@/components/icons/Trash.vue' /* webpackChunkName: "trash" */)),
        Save: defineAsyncComponent(() => import('@/components/icons/Save.vue' /* webpackChunkName: "trash" */)),
        InfoCircle: defineAsyncComponent(() =>
            import('@/components/icons/InfoCircle.vue' /* webpackChunkName: "infocircle" */),
        ),
        InfoCircleWhite: defineAsyncComponent(() =>
            import('@/components/icons/InfoCircleWhite.vue' /* webpackChunkName: "infocirclewhite" */),
        ),
        Check: defineAsyncComponent(() => import('@/components/icons/Check.vue' /* webpackChunkName: "check" */)),
        Pen: defineAsyncComponent(() => import('@/components/icons/Pen.vue' /* webpackChunkName: "pen" */)),
        ArrowLeft: defineAsyncComponent(() =>
            import('@/components/icons/ArrowLeft.vue' /* webpackChunkName: "arrowleft" */),
        ),
        ArrowRight: defineAsyncComponent(() =>
            import('@/components/icons/ArrowRight.vue' /* webpackChunkName: "arrowright" */),
        ),
        Calendar: defineAsyncComponent(() =>
            import('@/components/icons/Calendar.vue' /* webpackChunkName: "calendar" */),
        ),
        CloudDownloadAlt: defineAsyncComponent(() =>
            import('@/components/icons/CloudDownloadAlt.vue' /* webpackChunkName: "clouddownloadalt" */),
        ),
        Book: defineAsyncComponent(() => import('@/components/icons/Book.vue' /* webpackChunkName: "Book" */)),
        Chart: defineAsyncComponent(() => import('@/components/icons/Chart.vue' /* webpackChunkName: "Chart" */)),
        PaperPlant: defineAsyncComponent(() =>
            import('@/components/icons/PaperPlant.vue' /* webpackChunkName: "PaperPlant" */),
        ),
        Cog: defineAsyncComponent(() => import('@/components/icons/Cog.vue' /* webpackChunkName: "Cog" */)),
        Drag: defineAsyncComponent(() => import('@/components/icons/Drag.vue' /* webpackChunkName: "Drag" */)),
        Camera: defineAsyncComponent(() => import('@/components/icons/Camera.vue' /* webpackChunkName: "Camera" */)),
        Envelope: defineAsyncComponent(() =>
            import('@/components/icons/Envelope.vue' /* webpackChunkName: "Envelope" */),
        ),
        Edit: defineAsyncComponent(() => import('@/components/icons/Edit.vue' /* webpackChunkName: "Envelope" */)),
        Phone: defineAsyncComponent(() => import('@/components/icons/Phone.vue' /* webpackChunkName: "Phone" */)),
        MapMarker: defineAsyncComponent(() =>
            import('@/components/icons/MapMarker.vue' /* webpackChunkName: "MapMarker" */),
        ),
        Filter: defineAsyncComponent(() => import('@/components/icons/Filter.vue' /* webpackChunkName: "Filter" */)),
        File: defineAsyncComponent(() => import('@/components/icons/File.vue' /* webpackChunkName: "File" */)),
        Download: defineAsyncComponent(() =>
            import('@/components/icons/Download.vue' /* webpackChunkName: "Download" */),
        ),
        Tools: defineAsyncComponent(() => import('@/components/icons/Tools.vue' /* webpackChunkName: "Tools" */)),
        Email: defineAsyncComponent(() => import('@/components/icons/Email.vue' /* webpackChunkName: "Email" */)),
        Tag: defineAsyncComponent(() => import('@/components/icons/Tag.vue' /* webpackChunkName: "Tag" */)),
        TagSolid10: defineAsyncComponent(() => import('@/components/icons/TagSolid10.vue' /* webpackChunkName: "Tag" */)),
        Plus: defineAsyncComponent(() => import('@/components/icons/Plus.vue' /* webpackChunkName: "Plus" */)),
        Copy: defineAsyncComponent(() => import('@/components/icons/Copy.vue' /* webpackChunkName: "Copy" */)),
        Redo: defineAsyncComponent(() => import('@/components/icons/Redo.vue' /* webpackChunkName: "Redo" */)),
        InboxOut: defineAsyncComponent(() => import('@/components/icons/InboxOut.vue' /* webpackChunkName: "InboxOut" */)),
        TimesCircle: defineAsyncComponent(() =>
            import('@/components/icons/TimesCircle.vue' /* webpackChunkName: "TimesCircle" */),
        ),
        CannedResponse: defineAsyncComponent(() =>
            import('@/components/icons/CannedResponse.vue' /* webpackChunkName: "CannedResponse" */),
        ),
        ExternalLikeSquareAlt: defineAsyncComponent(() =>
            import('@/components/icons/ExternalLikeSquareAlt.vue' /* webpackChunkName: "ExternalLikeSquareAlt" */),
        ),
        PaperClip: defineAsyncComponent(() =>
            import('@/components/icons/PaperClip.vue' /* webpackChunkName: "ExternalLikeSquareAlt" */),
        ),
        TimesSolid12: defineAsyncComponent(() =>
            import('@/components/icons/TimesSolid12.vue' /* webpackChunkName: "ExternalLikeSquareAlt" */),
        ),
        TimesRegular14: defineAsyncComponent(() =>
            import('@/components/icons/TimesRegular14.vue' /* webpackChunkName: "TimesRegular14" */),
        ),
        GreetingRegular14: defineAsyncComponent(() =>
            import('@/components/icons/GreetingRegular14.vue' /* webpackChunkName: "GreetingRegular14" */),
        ),
        ClockRegular14: defineAsyncComponent(() =>
            import('@/components/icons/ClockRegular14.vue' /* webpackChunkName: "ClockRegular14" */),
        ),
        CogRegular14: defineAsyncComponent(() =>
            import('@/components/icons/CogRegular14.vue' /* webpackChunkName: "CogRegular14" */),
        ),
        InboxRegular14: defineAsyncComponent(() =>
            import('@/components/icons/InboxRegular14.vue' /* webpackChunkName: "InboxRegular14" */),
        ),
        EmojiRegular12: defineAsyncComponent(() =>
            import('@/components/icons/EmojiRegular12.vue' /* webpackChunkName: "EmojiRegular12" */),
        ),
        AttributeRegular12: defineAsyncComponent(() =>
            import('@/components/icons/AttributeRegular12.vue' /* webpackChunkName: "AttributeRegular12" */),
        ),
        SignOut,
        Bell,
        BellSolid,
        SortAsc,
        SortDesc,
        Times,
        Wifi,
        WifiSlash,
        InboxSolid,
        PersonSolid,
        BookSolid,
        ChartSolid,
        PaperPlantSolid,
        CogSolid,
        Ellipsis,
        EllipsisH,
        Ban,
        Archive,
        Emoji,
        Clock,
        VolumeUp,
        ExternalLink,
        BookAlt,
        Undo,
    },
    setup(props) {
        const textColor = ref(`text-${props.color}`);
        const classColor = computed(() => {
            return props.showClassText ? props.color : textColor.value;
        });
        const classBase = computed(() => {
            return {
                'ml-4p': props.type === 'left',
                'mr-4p': props.type === 'right',
            };
        });
        const iconName = computed(() => {
            return props.name ? props.name : '';
        });
        onMounted(() => {
            textColor.value = `text-${props.color}`;
        });
        onUpdated(() => {
            textColor.value = `text-${props.color}`;
        });
        return {
            classBase,
            iconName,
            classColor,
        };
    },
});
</script>
