import { useState, useEffect } from 'react'
import { openDatabase, putNote, deleteNote, getNotes } from '../../services/indexedDBService'

export const useIndexedDB = () => {
    const [notes, setNotes] = useState([])
    const [dbReady, setDbReady] = useState(false)

    useEffect(() => {
        const openD = async () => {
            try {
                await openDatabase()
                setDbReady(true)
            } catch (error) {
                console.error(error)
            }
        }
        openD()
    }, [])

    useEffect(() => {
        if (dbReady) {
            try {
                const loadNotes = async () => {
                    const loadedNotes = await getNotes()
                    setNotes(loadedNotes)
                }
                loadNotes()
            } catch (error) {
                console.error(error)
            }
        }
    }, [dbReady])

    const handlePutNote = async (note) => {
        if (dbReady) {
            try {
                await putNote(note)
                const updatedNotes = await getNotes()
                setNotes(updatedNotes)
            } catch (error) {
                console.error('Error putting note:', error)
            }
        }
    }

    const handleDeleteNote = async (noteId) => {
        if (dbReady) {
            try {
                await deleteNote(noteId)
                const updatedNotes = await getNotes()
                setNotes(updatedNotes)
            } catch (error) {
                console.error('Error deleting note:', error)
            }
        }
    }

    return { notes, handlePutNote, handleDeleteNote }
}
