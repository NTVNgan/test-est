declare interface Segment {
    org_id: string,
    workspace_id: string,
    name: string,
    description: string,
    group: number,
    order: number,
    priority: number,
    conditions: string | null,
    status: number,
    updated_at: string | Date | null,
    created_at: string | Date | null,
    _id: string,
    count_contact: number | null
}