export type columnItem = {
    title?: String;
    dataIndex: String;
    slots?: {
        title: String;
    },
    scopedSlots?: {
        customRender: String;
    };
    width?: String;
    minWidth?: String;
    maxWidth?: String;
};