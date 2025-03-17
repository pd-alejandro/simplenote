import { useEffect } from 'react'
import TaskCheckbox from './TaskCheckbox'
import TaskText from './TaskText'
import TaskRemove from './TaskRemove'

const Task = (props) => {

    useEffect(() => {
        if (props.task.isNew) {
            props.ref.current.classList.add('new-task')
            props.changeIsNew(props.task)
            setTimeout(() => {
                props.ref.current.classList.remove('new-task')
                props.ref.current.classList.add('task-item--ready')
                props.ref.current.querySelector('.task-item__text').focus()
            }, 300)
        } else {
            props.ref.current.classList.add('task-item--ready')
        }
    }, [props.task.isNew])


    return (
        <li
            ref={props.ref}
            className="task-item">
            <TaskCheckbox
                isDone={props.task.isDone}
                handleChange={props.handleChange}
                id={props.task.id} />
            <TaskText
                text={props.task.text}
                handleInput={props.updateTaskText} />
            <TaskRemove
                removeTask={props.removeTask} />
        </li >
    )
}

export default Task