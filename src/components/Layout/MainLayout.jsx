import { useCallback, useEffect, useRef, useState } from 'react'
import { useIndexedDB } from '../../hooks/useIndexedDB'
import { nanoid } from 'nanoid'
import TextModal from '../Modals/TextModal'
import ListModal from '../Modals/ListModal'

const MainLayout = (props) => {
    const [textModalOpen, setTextModalOpen] = useState(false)
    const [textModalNote, setTextModalNote] = useState(null)

    const [listModalOpen, setListModalOpen] = useState(false)
    const [listModalNote, setListModalNote] = useState(null)

    const { notes, handlePutNote, handleDeleteNote } = useIndexedDB()

    const [creationMenuOpen, setCreationMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setCreationMenuOpen(false)
            }
        }

        if (creationMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [creationMenuOpen])

    const openNoteModal = useCallback((note) => {
        setTextModalNote(note)
        setTextModalOpen(true)
    }, [])

    const openTaskModal = useCallback((note) => {
        setListModalNote(note)
        setListModalOpen(true)
    }, [])

    const closeNoteModal = useCallback((updatedNote) => {
        setTextModalOpen(false)
        setTimeout(() => {
            setTextModalNote(null)
        }, 200)
        if (updatedNote) {
            const hasContent = updatedNote.text?.length > 0
            if (updatedNote.title.length === 0 && !hasContent) return handleDeleteNote(updatedNote.id)
            handlePutNote(updatedNote)
        }
    }, [handleDeleteNote, handlePutNote])

    const createTextNote = useCallback(() => {
        const newTextNote = {
            id: nanoid(),
            title: '',
            text: '',
            creationDate: new Date(),
        }
        setTextModalNote(newTextNote)
        setTextModalOpen(true)
        setCreationMenuOpen(false)
    }, [])

    const closeTaskModal = useCallback((updatedNote) => {
        setListModalOpen(false)
        setTimeout(() => {
            setListModalNote(null)
        }, 200)
        if (updatedNote) {
            const hasContent = updatedNote.tasks?.some(task => task.text.length > 0)
            if (updatedNote.title.length === 0 && !hasContent) return handleDeleteNote(updatedNote.id)
            handlePutNote(updatedNote)
        }
    }, [handlePutNote, handleDeleteNote])

    const createTaskNote = useCallback(() => {
        const newTaskNote = {
            id: nanoid(),
            title: '',
            creationDate: new Date(),
            tasks: [
                {
                    id: nanoid(),
                    text: '',
                    isDone: false
                }
            ]
        }
        setListModalNote(newTaskNote)
        setListModalOpen(true)
        setCreationMenuOpen(false)
    }, [])

    const deleteNote = useCallback((e = null, noteId) => {
        e?.stopPropagation()
        if (listModalOpen) {
            setListModalOpen(false)
            setTimeout(() => {
                setListModalNote(null)
            }, 200)
        }
        if (textModalOpen) {
            setTextModalOpen(false)
            setTimeout(() => {
                setTextModalNote(null)
            }, 200)
        }
        handleDeleteNote(noteId)
    }, [handleDeleteNote])

    const toggleCreationMenu = useCallback(() => {
        setCreationMenuOpen(prev => {
            if (prev) document.activeElement?.blur()
            return !prev
        })
    }, [])

    const handleKeyDown = useCallback((e, note) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (note.text) {
                openNoteModal(note, e.currentTarget)
            } else {
                openTaskModal(note, e.currentTarget)
            }
        }
    }, [openNoteModal, openTaskModal])

    const getPlainText = (text, lines = 3) => {
            const tempElement = document.createElement("div")
            tempElement.innerHTML = text.replace(/<br\s*[/]?>/gi, '\n').replace(/<div\b[^>]*>/gi, '').replace(/<\/div>/gi, '\n')
            const tempArray = tempElement.innerText.split('\n')
            if (tempArray.length > 1 && lines === 1) return tempArray.splice(0, lines)+'...'
            return tempArray.splice(0, lines).join('\n')
    }

    return (
        <>
            <main inert={props.navOpen ||listModalOpen || textModalOpen ? true : undefined}>
                {notes.length > 0 ? (
                    <div className='note-list'>
                        {notes.map(note => (
                            <div
                                key={note.id}
                                className='note-list__note'
                                onClick={(e) => { if (note.text) { openNoteModal(note, e.currentTarget) } else { openTaskModal(note, e.currentTarget) } }}
                                onKeyDown={(e) => handleKeyDown(e, note)}
                                tabIndex={0}
                                role='button'>
                                <div className="note_header flex-row gap-025">
                                    {note.title && <h2 className='note_title'>{note.title}</h2>}
                                </div>

                                {(note.text && note.text.length > 0) && <p className='note_text'>{note.text.length > 88 ? getPlainText(note.text).slice(0, 85) + '...' : getPlainText(note.text)}</p>}
                                {(note.tasks?.length > 0 && note.tasks[0]?.text.length > 0) && <ul className="note_tasks">
                                    {note.tasks.slice(0, 3).map((task, index) => {
                                        if (task.text.length > 0) return (<li key={index} className={`note_task ${task.isDone ? 'note_task--completed' : ''} `}>
                                            {getPlainText(task.text, 1)}
                                        </li>)
                                    })}
                                </ul>}

                            </div>))} </div>) : (<p className='no-notes'>No notes</p>)}
            </main>

            <TextModal
                open={textModalOpen}
                note={textModalNote}
                handleClick={closeNoteModal}
                deleteNote={deleteNote}
                inert={props.navOpen ? true : undefined} />

            <ListModal
                open={listModalOpen}
                note={listModalNote}
                handleClick={closeTaskModal}
                deleteNote={deleteNote}
                inert={props.navOpen ? true : undefined} />

            <button
                className="note-list__add-note btn-primary"
                aria-label="Add note"
                onClick={toggleCreationMenu}
                aria-expanded={creationMenuOpen}
                aria-controls="create-note-menu"
                inert={props.navOpen ||listModalOpen || textModalOpen ? true : undefined}>
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className='note-list__add-icon'>
                    <path d="M256 413.098V98.902M98.902 256h314.196" />
                </svg>
            </button>

            <div
                id="create-note-menu"
                ref={menuRef}
                className={`note-list__menu${creationMenuOpen ? ' open' : ''}`}
                aria-hidden={!creationMenuOpen}>
                <button onClick={createTextNote}>Text
                    <svg className='note__icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="#1C274C" fillRule="evenodd" d="M3.464 3.464C2 4.93 2 7.286 2 12c0 4.714 0 7.071 1.464 8.535C4.93 22 7.286 22 12 22c4.714 0 7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464ZM9.952 6.25c-.43 0-.832 0-1.16.049-.371.055-.752.186-1.057.525-.294.327-.398.717-.443 1.089-.042.348-.042.78-.042 1.267v.57a.75.75 0 0 0 1.5 0v-.528c0-.543.001-.882.031-1.129.014-.116.032-.183.046-.22.012-.033.02-.043.023-.046h.001c.001-.002.002-.003.011-.008a.592.592 0 0 1 .152-.037c.204-.03.491-.032.986-.032h1.25v8.5H9.5a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5h-2.25v-8.5H14c.495 0 .782.002.986.032.092.014.135.03.152.037l.011.007v.001a.13.13 0 0 1 .024.045c.014.038.032.105.046.221.03.247.031.586.031 1.13v.527a.75.75 0 0 0 1.5 0v-.57c0-.488 0-.919-.042-1.267-.045-.372-.149-.762-.443-1.09-.305-.338-.686-.469-1.057-.524-.328-.05-.73-.05-1.16-.049H9.952Z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={createTaskNote}>List
                    <svg className='list__icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="#1C274C" fillRule="evenodd" d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22Zm4.03-13.03a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 4.47-4.47a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                </button>
            </div>

        </>
    )
}

export default MainLayout