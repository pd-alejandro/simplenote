import { useCallback, useEffect, useRef, useState } from "react"
import formatDate from "../../../utils/formatdate"
import DOMPurify from 'dompurify'

const TextModal = ({ open, note, handleClick, deleteNote, inert }) => {
    const [isClosing, setIsClosing] = useState(false)
    const titleRef = useRef(null)
    const textRef = useRef(null)

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.value = note?.title || ''
        }
        if (textRef.current) {
            textRef.current.innerHTML = DOMPurify.sanitize(note?.text) || ''
        }
    }, [note])

    const handleClose = () => {
        document.activeElement?.blur()
        setIsClosing(true)
        let updatedNote
        const isTitleChanged = note.title !== titleRef.current.value
        const isTextChanged = note.text !== textRef.current.innerHTML
        if (isTitleChanged || isTextChanged) {
            updatedNote = {
                ...note,
                title: titleRef.current.value,
                text: textRef.current.innerHTML,
                editedDate: new Date()
            }
        }
        setTimeout(() => {
            setIsClosing(false)
        }, 300)
        handleClick(updatedNote)
    }

    const handleDelete = (e) => {
        document.activeElement?.blur()
        setIsClosing(true)
        deleteNote(e, note.id)
        setTimeout(() => {
            setIsClosing(false)
        }, 300)
    }

    const handlePaste = useCallback((e) => {
        e.preventDefault()
        let text = e.clipboardData.getData('text/plain')
        text = text

        const lines = text.split('\n')
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)

        if (!selection.isCollapsed) range.deleteContents()

        lines.forEach((line, index) => {
            if (index > 0) range.insertNode(document.createElement("br"))
            range.insertNode(document.createTextNode(line))
        })

        range.collapse(false)
    })

    return (
        <>
            {open &&
                <div
                    className='modal-backdrop'
                    onClick={handleClose}
                    aria-hidden="true"></div>}
            <div
                className={`modal${open ? ' modal--open' : ''}${isClosing ? ' modal--closing' : ''}`}
                aria-hidden={!open}
                inert={inert}>
                <div
                    className="modal-header flex-column">
                    <div className="flex-row gap-025">
                        <input
                            ref={titleRef}
                            type="text"
                            name={`title-${note?.id}`}
                            id=""
                            className="note-modal__title"
                            placeholder="Title"
                            defaultValue={note?.title}
                        />
                        <button
                            className="note-modal__close-btn"
                            aria-label="Close note"
                            onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox='0 0 512 512'
                                className='note_close-icon'
                                aria-hidden="true">
                                <path
                                    d="m144.915 367.085 222.17-222.17M144.915 144.915l222.17 222.17" />
                            </svg>
                        </button>
                    </div>
                    <div
                        className='flex-row wrapper'>
                        {note?.editedDate && <small className="date"><span>Edited:</span> {note && formatDate(note?.editedDate)}</small>}
                        <button
                            className="delete-task btn-tertiary"
                            onClick={(e) => {
                                if (window.confirm("Delete this note?")) {
                                    handleDelete(e, note.id)
                                }
                            }}>
                            delete
                        </button>
                    </div>
                </div>

                <div
                    ref={textRef}
                    className="note-modal__text"
                    onPaste={(event) => handlePaste(event)}
                    data-placeholder="Write your note here"
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note?.text) }}
                    // aria-label={t['content-label']}
                    role="textbox"
                />

            </div >
        </>
    )
}

export default TextModal