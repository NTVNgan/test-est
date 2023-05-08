declare type Groups = string[];

declare type GroupsRecent = object[];
declare interface RecentPage {
    _id: string;
    _auid: null;
    org_id: string;
    workspace_id: string;
    contact_id: string;
    source: number;
    type: number;
    action: null;
    content: object;
    is_last: boolean;
    status: number;
    created_at: string;
    __v: number;
}