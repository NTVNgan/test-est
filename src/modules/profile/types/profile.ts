declare interface ChangePasswordForm {
    new_password: string;
    current_password: string;
}

declare interface ChangePasswordResponse {
    _id?: string;
    email?: string;
    created_at?: string;
    full_name?: string;
    password?: string;
    phone?: string;
}
