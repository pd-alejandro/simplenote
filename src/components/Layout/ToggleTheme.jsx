import { useEffect, useState } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/localstorage'

const getThemePreference = () => {
    let themePreference = loadFromLocalStorage('theme')
    if (themePreference) return themePreference

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const ThemeButton = ({ themeName, handleChange, currentTheme }) => {

    return (
        <label
            htmlFor={`radio--${themeName}`}
            aria-label={`${themeName} theme`}>
            <input
                type="radio"
                name="theme"
                id={`radio--${themeName}`}
                checked={currentTheme === themeName}
                onChange={() => handleChange(themeName)}
                value={themeName} />
            <div
                className="custom-radio"
                aria-hidden={true}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="custom-radio__check check-icon">
                    <path
                        d="m144.915 256 67.66 128 154.51-256" />
                </svg>

            </div>
            <span>
                {themeName}
            </span>
        </label>
    )
}

const ToggleTheme = () => {
    let [theme, setTheme] = useState(getThemePreference)

    useEffect(() => {
        document.body.classList.remove('light', 'dark')
        document.body.classList.add(theme)
        saveToLocalStorage('theme', theme)
    }, [theme])

    return (
        <>
            <ThemeButton themeName="light" handleChange={setTheme} currentTheme={theme} />
            <ThemeButton themeName="dark" handleChange={setTheme} currentTheme={theme} />
        </>
    )
}

export default ToggleTheme