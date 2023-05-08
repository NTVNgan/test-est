declare interface Teammate { 
    id: String,
    avatar_src: String,
    avatar_bg: String,
    name: String,
    full_name: String,
    username: String,
    email: String,
    status: Number,
    online_status: Number,
    role_name: String,
    created_at: String,
    updated_at: String,
    is_deleted?: boolean
}

declare interface InviteTeammateEmail {
    email: string;
    roleId: string;
    error: string;
}