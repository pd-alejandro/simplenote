import { createRef, useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import Task from '../Task/Task'
import formatDate from '../../../utils/formatdate'
import { ripple } from '../../../utils/ripple'

const ListModal = ({ open, note, handleClick, deleteNote, inert }) => {
    const [tasks, setTasks] = useState(note?.tasks ? [...note.tasks] : [])
    const [isClosing, setIsClosing] = useState(false)
    const titleRef = useRef(null)
    const taskRefs = useRef({})

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.value = note?.title || ''
        }
        if (taskRefs.current) {
            taskRefs.current.innerHTML = note?.tasks || ''
        }

        setTasks(note?.tasks ? [...note.tasks.sort((a, b) => a.isDone - b.isDone)] : [])
    }, [note])

    const handleClose = () => {
        document.activeElement?.blur()
        setIsClosing(true)
        let updatedNote
        const isTitleChanged = note?.title !== titleRef.current.value
        const isTasksChanged = note?.tasks?.length !== tasks.length || note?.tasks?.some((task, index) => task !== tasks[index])
        if (isTitleChanged || isTasksChanged) {
            updatedNote = {
                ...note,
                title: titleRef.current.value,
                tasks: tasks,
                editedDate: new Date()
            }
        }
        setTimeout(() => {
            setIsClosing(false)
        }, 300)
        handleClick(updatedNote)
    }

    const toggleIsDone = (taskToToggle) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskToToggle.id
                    ? { ...task, isDone: !task.isDone }
                    : task
            ).sort((a, b) => a.isDone - b.isDone)
        )
    }

    const createTask = (e) => {
        ripple(e)
        const newTask = {
            id: nanoid(),
            text: '',
            isDone: false
        }

        setTasks(prevTasks => [...prevTasks, newTask])
        taskRefs.current[newTask.id] = createRef()
    }

    const deleteTask = (id) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
        delete taskRefs.current[id]
    }

    const updateTaskText = (id, newText) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? { ...task, text: newText }
                    : task
            )
        )
    }
    const handleDelete = (e) => {
        document.activeElement?.blur()
        setIsClosing(true)
        deleteNote(e, note.id)
        setTimeout(() => {
            setIsClosing(false)
        }, 300)
    }

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
                        className='wrapper flex-row'>
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
                <ul
                    className="task-list">
                    {tasks.map(task => {
                        if (!taskRefs.current[task.id]) {
                            taskRefs.current[task.id] = createRef()
                        }
                        return (<Task
                            key={task.id}
                            ref={taskRefs.current[task.id]}
                            task={task}
                            handleChange={() => toggleIsDone(task)}
                            removeTask={() => deleteTask(task.id)}
                            updateTaskText={(newText) => updateTaskText(task.id, newText)} />
                        )
                    })}
                </ul>
                <button
                    className="task-list__add-button btn-primary"
                    onClick={(e) => createTask(e)}>
                    Add task
                </button>
            </div>
        </>
    )
}

export default ListModal