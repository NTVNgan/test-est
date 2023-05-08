/*
  Install local database: Localforage to save recently emoji, stickers
*/
import localforage from 'localforage'
localforage.config({
    driver      : localforage.WEBSQL,
    name        : 'linebaseWidgetDB',
    version     : 2.0,
    size        : 4980736,
    storeName   : 'linebasedb',
    description : 'linebase database from local'
})

const database = localforage.createInstance({
  name: "linebaseWidgetDB",
  storeName: window.location.hostname
})

export default database

const dbName = {
  emoji: 'chat-emojis',
  listEmoji: 'list-emoji'
}

export { dbName }
