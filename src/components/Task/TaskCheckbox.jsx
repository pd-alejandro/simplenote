const TaskCheckbox = ({ isDone, handleChange, id }) => {

    return (
        <>
            <input
                type="checkbox"
                name={`check__${id}`}
                id={`check__${id}`}
                className="checkbox--hidden"
                checked={isDone}
                onChange={handleChange} />
            <label
                htmlFor={`check__${id}`}
                className="checkmark"
                aria-label={`task is ${isDone ? 'done' : 'pending'}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="check-icon"
                    aria-hidden={true}>
                    <path
                        d="m144.915 256 67.66 128 154.51-256" />
                </svg>
            </label >
        </>
    )
}

export default TaskCheckbox