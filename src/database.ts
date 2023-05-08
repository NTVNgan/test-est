/*
  Install local database: Localforage to save recently emoji, stickers
*/
import localforage from 'localforage';
localforage.config({
    driver: localforage.WEBSQL,
    name: 'linebaseDB',
    version: 2.0,
    size: 4980736,
    storeName: 'linebasedb',
    description: 'linebase database from local',
});

const database = localforage.createInstance({
    name: 'linebaseDB',
    storeName: window.location.hostname,
});

export default database;

const dbName: any = {
    emoji: 'chat-emojis', // list emoji used more than 5 time in Inbox Composer.
    listEmoji: 'list-emoji', // list emoji count time that emoji was used in Inbox Composer.
    widgetSetingEmoji: 'widget-setting-emoji', // list emoji used more than 5 time in Setting Chat widget.
    widgetSetingEmojiCount: 'widget-setting-emoji-count', // list emoji count time that emoji was used in Setting Chat widget.
};

export { dbName };
