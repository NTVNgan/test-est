const message = {
    MESSAGE: 1,
    LOG: 2,
    IMAGE: 3,
    // VIDEO: 4,
    // AUDIO: 5,
    EMAIL: 6,
    // FAQ: 7
    // STICKER
    // DISCOUNT
};

const MESSAGE_TYPE = {
    TEXT: 1,
    FILE: 2,
    IMAGE: 3,
    // VIDEO: 4,
    // AUDIO: 5,
    EMAIL: 6,
    // FAQ: 7
    // STICKER
    // DISCOUNT
};

const SENT_BY = {
    USER: 1,
    CUSTOMER: 2,
};

const LOG = {
    DONE: 1,
    LEFT: 2,
    MARKED: 3,
    ASSIGNED: 4,
    UNASSIGNED: 5,
    REOPENED: 6,
    RESOLVED: 7,
};

const ONLINE_STATUS = {
    ONLINE: 1,
    OFFLINE: 3,
    IDLE: 5,
};

const GROUP = { MESSAGE: 1, LOG: 2, ACTIVITY: 3 };

const STATUS = { DELETED: 0, ACTIVATED: 1, RESOLVED: 3 };

const MESSAGE_ATTACHMENT_TYPE = {
    FILE: 1,
    IMAGE: 2,
    VIDEO: 3,
    AUDIO: 4,
    MIXED: 5,
};

const CONVERSATION_STATUS = { DELETED: 0, ACTIVATED: 1, RESOLVED: 3, ARCHIVED: 5 };

const CONTACT_STATUS = { DELETE: 0, ENABLE: 1, BLOCK: 2, DISABLE: 3, ARCHIVED: 4 };

export default {
    message,
    SENT_BY,
    LOG,
    GROUP,
    STATUS,
    ONLINE_STATUS,
    MESSAGE_ATTACHMENT_TYPE,
    MESSAGE_TYPE,
    CONVERSATION_STATUS,
    CONTACT_STATUS,
};
