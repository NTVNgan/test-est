declare interface LoginForm {
    email: string;
    password: string;
    remember_me?: boolean;
    workspace_id?: string;
}

declare interface UserAuth {
    token: string;
}

declare type LoginResponse = string[];

declare interface ForgotPassword {
    email: string;
}
declare interface ResetNewPass {
    urlParams: string;
    password: string;
}

declare interface SignupForm {
    email: string;
    password: string;
}

declare interface SignupResponse {
    _id: string;
    email: string;
    username: string;
}

declare interface SendEmailActive {
    email: string;
    user_id: string;
}

declare interface CreatePassForm {
    user_id: string;
    hash: string;
    password: any;
}

declare interface ActiveInviteEmail {
    user_id: string;
    hash: string;
}