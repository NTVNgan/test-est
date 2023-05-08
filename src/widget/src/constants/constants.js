const SENT_BY = {
    USER: 1,
    CUSTOMER: 2,
};

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

const TYPE = {
    MESSAGE: {
        // show as a message (which have a human sender) with special cases
        TEXT: 1, // text message chat
        FILE: 2,
        IMAGE: 3,
        VIDEO: 4,
        AUDIO: 5,
        FAQ: 7,
        STICKER: 8,
        DISCOUNT: 9,
    },
};

const MESSAGE_ATTACHMENT_TYPE = {
    FILE: 1,
    IMAGE: 2,
    VIDEO: 3,
    AUDIO: 4,
    MIXED: 5,
};

const GROUP = { MESSAGE: 1, LOG: 2, ACTIVITY: 3 };

const STATUS = { DELETED: 0, ACTIVATED: 1, RESOLVED: 3 };

const WIDGET_STATUS = {
    'HOME': 1,
    'EMAIL_INPUT': 2,
    'CHAT': 3,
}

export default {
    SENT_BY,
    message,
    TYPE,
    STATUS,
    GROUP,
    MESSAGE_TYPE,
    MESSAGE_ATTACHMENT_TYPE,
    WIDGET_STATUS
};
