import { memo, useCallback, useEffect, useRef } from "react"
import DOMPurify from "dompurify"

const TaskText = ({ text, handleInput }) => {
    const divRef = useRef(null)
    const initialized = useRef(false)

    const handleInputInternal = useCallback(() => {
        if (divRef.current) {
            const updatedText = DOMPurify.sanitize(divRef.current.innerHTML)
            handleInput(updatedText)
        }
    }, [handleInput])

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const selection = window.getSelection()
            const range = selection.getRangeAt(0)
            const br = document.createElement("br")
            range.insertNode(br)
            range.collapse(false)
        }
    }, [])

    const handlePaste = useCallback((e) => {
        document.activeElement?.blur()
        e.preventDefault()
        let text = e.clipboardData.getData('text/plain')
        text = DOMPurify.sanitize(text)

        const lines = text.split('\n')
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)

        if (!selection.isCollapsed) range.deleteContents()

        lines.forEach((line, index) => {
            if (index > 0) range.insertNode(document.createElement("br"))
            range.insertNode(document.createTextNode(line))
        })

        range.collapse(false)

        handleInputInternal()
    }, [handleInputInternal])

    useEffect(() => {
        let isMounted = true
        if (!initialized.current && divRef.current && isMounted) {
            let sanitizedText = DOMPurify.sanitize(text)
            divRef.current.innerHTML = sanitizedText
            initialized.current = true
        }
        return () => {
            isMounted = false
        }
    }, [text])

    return (
        <>
            <div
                ref={divRef}
                className="task-item__text"
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
                onInput={handleInputInternal}
                onPaste={handlePaste}
                role="textbox"
                aria-label="write your task here"
                aria-multiline="true"
                aria-describedby="task-help"
                tabIndex={0} />
            <p id="task-help" className="sr-only">You can write your task here. Press enter to add a new task.</p>
        </>
    )
}

export default memo(TaskText)