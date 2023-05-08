export type AppRouteNames =
    | 'SignIn'
    | 'SignUp'
    | 'ForgotPassword'
    | 'CreatePassword'
    | 'Inbox'
    | 'InboxSample'
    | 'InboxGroups'
    | 'InboxSearch'
    | 'Contact'
    | 'ContactList'
    | 'ContactListBySegment'
    | 'ContactListBySearch'
    | 'ContactDetail'
    | 'ArticleSample'
    | 'ReportSample'
    | 'OutboundSample'
    | 'SettingInstallation'
    | 'Setting'
    | 'ProfileAccountDetail'
    | 'ProfileNotification'
    | 'Error'
    | 'Error404'
    | 'Error500'
    | 'ErrorAccessDenied'
    | 'Article';

export type AppDSRouteNames =
    | 'design-sytem'
    | 'demo'
    | 'input'
    | 'button'
    | 'checkbox'
    | 'button-group'
    | 'avatar'
    | 'card'
    | 'colorpicker'
    | 'alert'
    | 'textfield'
    | 'select'
    | 'tag'
    | 'toggle'
    | 'dropdown'
    | 'dropdown2'
    | 'pagination'
    | 'modal'
    | 'table'
    | 'accordion'
    | 'radio'
    | 'slider'
    | 'drawer'
    | 'step'
    | 'tooltip'
    | 'badge'
    | 'tab'
    | 'datepicker'
    | 'toast'
    | 'texteditor'
    | 'progress-bar'
    | 'thumbnail'
    | 'dropzone'
    | 'header'
    | 'sidebar'
    | 'submenu'
    | 'scrollbar'
    | 'list-group'
    | 'input-tiptap';

export interface DSRouterLink {
    name: string;
    path: AppDSRouteNames;
}
export interface RouterLink {
    label: string;
    name: AppRouteNames;
    icon?: string;
    permissions?: number[]
}
