declare interface Contact {
    _id?: string;
    _auid?: string;
    org_id?: string;
    workspace_id?: string;
    guest_id: string; // visitor id will be generated if not detect from the B2B2C³ cookies/local storage
    hash_id: string; // is customer id & be set by App's user to regconize this becomes a customer
    email: string; // email format
    prefix: string; // Mr|Ms|Mrs|Mx
    full_name: string;
    suffix: string; //
    nickname: string; //
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    nationality: string; // countryId
    language: string; // languageId
    browser_version: string;
    browser_language: string;
    signed_up: Date;
    browser: string;
    timezone: string;
    visit: number; // The number of times a customer visits your website
    last_seen: Date;
    first_seen: Date;
    os: any;
    avatar_src: string; // set default avatar
    avatar_bg: string; // set default avatar
    type: number; // [customer|visitor]
    source: number; // ["import": from external file|"system": gen by system|"app": add from App|"api": push from API]
    online_status: number; // [1: offline|3: online|5: idle]
    status: number; // [0: deleted|1: active]
    tags: Array<string>;
    attributes: Array<{ _id?: string; id: string; value: any }>;
    updated_at?: Date;
    created_at?: Date;
}
