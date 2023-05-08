declare interface User {
    id?: string;
    _id?: string;
    org_id?: string;
    workspace_id?: string;
    _auid?: string;
    role_id?: string;
    permissions?: string[];
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    avatar_src?: string;
    password?: string;
    password_old?: string;
    number_login?: number;
    phone?: string;
    address?: string;
    view_segment_ids?: string[];
    created_at?: object;
    remember_me?: boolean;
    is_root?: boolean;
    is_setting_org?: boolean;
    is_setting_widget?: boolean;
    last_sent_reset_pass?: object;
    pin_attribute?: string[];
    custom_data_sort?: number[];
}

declare interface UserWorkspace {
    workspace_id: string;
    workspace_name: string;
}
