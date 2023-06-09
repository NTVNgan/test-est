<script>
import { h } from 'vue';
import Popover from '../Popover/Popover.vue';
import CalendarNav from '../CalendarNav/CalendarNav.vue';
import CalendarDay from '../CalendarDay/CalendarDay.vue';
import { childMixin, slotMixin } from '../utils/mixins';
import { getPopoverTriggerEvents } from '../utils/popovers';
import { createGuid } from '../utils/helpers';

export default {
    name: 'CalendarPane',
    emits: ['update:page'],
    mixins: [childMixin, slotMixin],
    inheritAttrs: false,
    render() {
        // Header
        const header =
            this.safeSlot('header', this.page) ||
            // Default header
            h('div', { class: `vc-header align-${this.titlePosition}` }, [
                // Header title
                h(
                    'div',
                    {
                        class: 'vc-title',
                        ...this.navPopoverEvents,
                    },
                    [this.safeSlot('header-title', this.page, this.page.title)],
                ),
                // Navigation popover
                h(
                    Popover,
                    {
                        id: this.navPopoverId,
                        contentClass: 'vc-nav-popover-container',
                    },
                    {
                        // Navigation pane
                        default: () =>
                            h(
                                CalendarNav,
                                {
                                    value: this.page,
                                    validator: this.canMove,
                                    onInput: $event => this.move($event),
                                },
                                {
                                    ...this.$slots,
                                },
                            ),
                    },
                ),
            ]);

        // Weeks
        const weeks = h(
            'div',
            {
                class: 'vc-weeks',
            },
            [
                ...this.weekdayLabels.map((wl, i) =>
                    h(
                        'div',
                        {
                            key: i + 1,
                            class: [
                                'vc-weekday text-12 mb-8p',
                                wl !== 'Sat' ? 'mr-2p' : '',
                                !this.isRange && this.format(this.dateValue, 'WWW') === wl
                                    ? 'font-medium text-neutrals-900'
                                    : 'text-neutrals-500',
                            ],
                        },
                        [wl],
                    ),
                ),
                ...this.page.days.map(day =>
                    h(CalendarDay, {
                        ...this.$attrs,
                        day,
                        isRange: this.isRange,
                        dateValue: this.dateValue,
                        slots: this.$slots,
                    }),
                ),
            ],
        );

        return h(
            'div',
            {
                class: 'vc-pane',
                ref: 'pane',
            },
            [header, weeks],
        );
    },
    props: {
        page: Object,
        titlePosition: String,
        navVisibility: String,
        isRange: Boolean,
        dateValue: [Date, Object],
        canMove: {
            type: Function,
            default: () => true,
        },
    },
    data() {
        return {
            navPopoverId: createGuid(),
        };
    },
    computed: {
        navVisibility_() {
            return this.propOrDefault('navVisibility', 'navVisibility');
        },
        navPlacement() {
            switch (this.titlePosition) {
                case 'left':
                    return 'bottom-start';
                case 'right':
                    return 'bottom-end';
                default:
                    return 'bottom';
            }
        },
        navPopoverEvents() {
            return getPopoverTriggerEvents({
                id: this.navPopoverId,
                visibility: this.navVisibility_,
                placement: this.navPlacement,
                modifiers: [{ name: 'flip', options: { fallbackPlacements: ['bottom'] } }],
                isInteractive: true,
                isRenderFn: true,
            });
        },
        weekdayLabels() {
            return this.locale.getWeekdayDates().map(d => this.format(d, 'WWW'));
        },
    },
    methods: {
        move(page) {
            this.$emit('update:page', page);
        },
    },
};
</script>

<style lang="css">
@import './calendar-pane.css';
</style>
