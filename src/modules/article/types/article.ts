declare interface Article {
    _id: string;
    _auid: string;
    org_id: string;
    workspace_id: string;
    title: string;
    summary?: any;
    body?: any;
    collection_id?: any; 
    section_id?: any;
    status: number;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    __v: number;
}
