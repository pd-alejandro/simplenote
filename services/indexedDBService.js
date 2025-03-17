const DB_NAME = 'simpletask'
const DB_VERSION = 2
const OBJECT_STORE_NAME = 'notes'

let dbPromise

const openDatabase = () => {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION)

            request.onerror = () => reject(request.error)

            request.onupgradeneeded = (event) => {
                const db = event.target.result

                if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                    const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' })
                    objectStore.createIndex('editedIndex', 'editedDate', { unique: false })
                }
            }

            request.onsuccess = () => {
                let db = request.result

                db.onversionchange = () => {
                    db.close()
                    alert('The database is outdated. Please refresh the tab.')
                }

                resolve(db)
            }
        })
    }
    return dbPromise
}

const putNote = async (note) => {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite')
        let store = transaction.objectStore(OBJECT_STORE_NAME)
        let request = store.put(note)

        request.onsuccess = () => {
            resolve()
        }
        request.onerror = () => reject(request.error)
    })
}

const deleteNote = async (noteId) => {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite')
        let store = transaction.objectStore(OBJECT_STORE_NAME)
        let request = store.delete(noteId)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

const getNotes = async () => {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(OBJECT_STORE_NAME, 'readonly')
        let store = transaction.objectStore(OBJECT_STORE_NAME)

        let index = store.index('editedIndex')
        let request = index.openCursor(null, 'prev')

        let notes = []
        request.onsuccess = (event) => {
            let cursor = event.target.result
            if (cursor) {
                notes.push(cursor.value)
                cursor.continue()
            } else {
                resolve([...notes])
            }
        }
        request.onerror = () => reject(request.error)
    })
}

export { openDatabase, putNote, deleteNote, getNotes }