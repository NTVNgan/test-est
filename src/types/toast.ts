export default interface Toast {
    id?: string;
    title: string;
    type: string;
    timeout: number;
    icon?: string;
    iconColor?: string;
    btnLabel?: string;
    btnFunction?: <T = unknown, R = unknown>(args?: T | undefined) => R;
}
