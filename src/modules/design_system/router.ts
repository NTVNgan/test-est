export default [
    {
        path: '/design-system',
        meta: { layout: 'DSLayout' },
        component: () => import('@/layouts/LayoutDS.vue' /* webpackChunkName: "LayoutDS" */),
        children: [
            {
                path: 'demo',
                name: 'demo',
                component: () => import(/* webpackChunkName: "ds-input" */ '@/modules/design_system/DemoI18n.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'scrollbar',
                name: 'scrollbar',
                component: () => import(/* webpackChunkName: "ds-input" */ '@/modules/design_system/DSScrollbar.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'input',
                name: 'input',
                component: () => import(/* webpackChunkName: "ds-input" */ '@/modules/design_system/DSInput.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'input-tiptap',
                name: 'inputtiptap',
                component: () => import(/* webpackChunkName: "ds-input-tiptap" */ '@/modules/design_system/DSInputTiptap.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'button',
                name: 'button',
                component: () => import(/* webpackChunkName: "ds-button" */ '@/modules/design_system/DSButton.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'checkbox',
                name: 'checkbox',
                component: () => import(/* webpackChunkName: "ds-checkbox" */ '@/modules/design_system/DSCheckbox.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'button-group',
                name: 'button-group',
                component: () =>
                    import(/* webpackChunkName: "ds-buttongroup" */ '@/modules/design_system/DSButtonGroup.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'avatar',
                name: 'avatar',
                component: () => import(/* webpackChunkName: "ds-avatar" */ '@/modules/design_system/DSAvatar.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'slider',
                name: 'slider',
                component: () => import(/* webpackChunkName: "ds-avatar" */ '@/modules/design_system/DSSlider.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'card',
                name: 'card',
                component: () => import(/* webpackChunkName: "ds-card" */ '@/modules/design_system/DSCard.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'colorpicker',
                name: 'colorpicker',
                component: () =>
                    import(/* webpackChunkName: "ds-datepicker" */ '@/modules/design_system/DSColorPicker.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'alert',
                name: 'alert',
                component: () => import(/* webpackChunkName: "ds-alert" */ '@/modules/design_system/DSAlert.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'thumbnail',
                name: 'thumbnail',
                component: () =>
                    import(/* webpackChunkName: "ds-thumbnail" */ '@/modules/design_system/DSThumbnail.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'textfield',
                name: 'textfield',
                component: () =>
                    import(/* webpackChunkName: "ds-textfield" */ '@/modules/design_system/DSTextfield.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'select',
                name: 'select',
                component: () => import(/* webpackChunkName: "ds-select" */ '@/modules/design_system/DSSelect.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'tag',
                name: 'tag',
                component: () => import(/* webpackChunkName: "ds-tag" */ '@/modules/design_system/DSTag.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'toggle',
                name: 'toggle',
                component: () => import(/* webpackChunkName: "ds-toggle" */ '@/modules/design_system/DSToggle.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'dropdown',
                name: 'dropdown',
                component: () => import(/* webpackChunkName: "ds-dropdown" */ '@/modules/design_system/DSDropdown.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'dropdown2',
                name: 'newdropdown',
                component: () => import(/* webpackChunkName: "ds-dropdown" */ '@/modules/design_system/DSDropdown2.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'pagination',
                name: 'pagination',
                component: () => import(/* webpackChunkName: "ds-pagin" */ '@/modules/design_system/DSPagination.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'modal',
                name: 'modal',
                component: () => import(/* webpackChunkName: "ds-modal" */ '@/modules/design_system/DSModal.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'table',
                name: 'table',
                component: () => import(/* webpackChunkName: "ds-table" */ '@/modules/design_system/DSTable.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'accordion',
                name: 'accordion',
                component: () =>
                    import(/* webpackChunkName: "ds-accordion" */ '@/modules/design_system/DSAccordion.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'radio',
                name: 'radio',
                component: () => import(/* webpackChunkName: "ds-radio" */ '@/modules/design_system/DSRadio.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'drawer',
                name: 'drawer',
                component: () => import(/* webpackChunkName: "ds-drawer" */ '@/modules/design_system/DSDrawer.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'texteditor',
                name: 'texteditor',
                component: () => import(/* webpackChunkName: "ds-texteditor" */ '@/modules/design_system/DSTextEditor.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'step',
                name: 'step',
                component: () => import(/* webpackChunkName: "ds-step" */ '@/modules/design_system/DSStep.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'tooltip',
                name: 'tooltip',
                component: () => import(/* webpackChunkName: "ds-tooltip" */ '@/modules/design_system/DSTooltip.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'badge',
                name: 'badge',
                component: () => import(/* webpackChunkName: "ds-badge" */ '@/modules/design_system/DSBadge.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'tab',
                name: 'tab',
                component: () => import(/* webpackChunkName: "ds-tab" */ '@/modules/design_system/DSTab.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'datepicker',
                name: 'datePicker',
                component: () =>
                    import(/* webpackChunkName: "ds-datepicker" */ '@/modules/design_system/DSDatePicker.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'toast',
                name: 'toast',
                component: () => import(/* webpackChunkName: "ds-toast" */ '@/modules/design_system/DSToast.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'progress-bar',
                name: 'progress-bar',
                component: () =>
                    import(/* webpackChunkName: "ds-progressbar" */ '@/modules/design_system/DSProgressBar.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'dropzone',
                name: 'dropzone',
                component: () => import('@/modules/design_system/DSDropzone.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'header',
                name: 'Header',
                component: () => import('@/modules/design_system/DSHeader.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                path: 'submenu',
                name: 'Submenu',
                component: () => import('@/modules/design_system/DSSubmenu.vue'),
                meta: { layout: 'DSLayout' },
            },
            {
                name: 'List',
                path: 'list-group',
                component: () => import('@/modules/design_system/DSList.vue'),
                meta: { layout: 'DSLayout' },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Error404' },
        component: () =>
            import(/* webpackChunkName: "Error404" */ '@/modules/error/views/Error404.vue'),
    },
];
