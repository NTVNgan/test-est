declare interface GetAttributeParams { 
    page: number;
    limit: number;
}
declare interface Attribute {
    _id: string;
    org_id: string;
    workspace_id: string;
    _auid: string;
    name: string;
    description: string;
    type: number;
    datatype: number;
    status: number;
    updated_at: Date;
    created_at: Date;
}