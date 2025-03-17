const saveToLocalStorage = (item, value) => {
    let newValue = (value instanceof Object) ? JSON.stringify(value) : value
    localStorage.setItem(item, newValue)
}

const loadFromLocalStorage = (item, isObjectExpected = false) => {
    const value = localStorage.getItem(item)

    if (!value) {
        return null
    }

    if (isObjectExpected) {
        try {
            const parsedValue = JSON.parse(value)

            if (parsedValue && (typeof parsedValue === 'object' || Array.isArray(parsedValue))) {
                if (Array.isArray(parsedValue) || Object.keys(parsedValue).length > 0) {
                    return parsedValue
                }
            }
            return null
        } catch (error) {
            console.log(error)
            return null
        }
    }

    return value
}

export { saveToLocalStorage, loadFromLocalStorage }