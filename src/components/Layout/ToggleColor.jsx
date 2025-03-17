import { useState, useEffect } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/localstorage'

const colors = [
    {
        name: 'red',
        base: 10,
        lightness: 35
    },
    {
        name: 'orange',
        base: 60,
        lightness: 80
    },
    {
        name: 'green',
        base: 105,
        lightness: 45
    },
    {
        name: 'blue',
        base: 285,
        lightness: 75
    },
    {
        name: 'purple',
        base: 320,
        lightness: 35
    }
]

const getColorPreference = () => {
    let colorPreference = loadFromLocalStorage('color', true)
    if (colorPreference) return colorPreference

    let newColor = {
        base: 10,
        lightness: 35
    }
    return newColor
}

const ColorItem = ({ name, colorBase, colorLightness, currentColor, handleChange }) => {

    return (
        <label
            htmlFor={`radio--${name}`}
            aria-label={`set theme color ${name}`}>
            <input
                type="radio"
                name="theme-color"
                id={`radio--${name}`}
                checked={currentColor === colorBase}
                onChange={() => handleChange({
                    base: colorBase,
                    lightness: colorLightness
                })}
                value={name} />
            <div
                className="custom-radio"
                style={
                    {
                        backgroundColor: `lch(${colorLightness} 100% ${colorBase})`
                    }
                }
                aria-hidden={true}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="custom-radio__check check-icon">
                    <path
                        d="m144.915 256 67.66 128 154.51-256" />
                </svg>
            </div>
        </label>
    )
}

const ToggleColor = () => {
    const [color, setColor] = useState(getColorPreference)

    useEffect(() => {
        document.documentElement.style.setProperty('--color-base', color.base)
        document.documentElement.style.setProperty('--color-lightness', color.lightness)
        document.querySelector('meta[name=theme-color]').setAttribute('content', `lch(${color.lightness} 100% ${color.base})`)
        saveToLocalStorage('color', {
            base: color.base,
            lightness: color.lightness
        })
    })

    return (
        <>
            {colors.map((colorItem) => {
                return <ColorItem
                    key={colorItem.name}
                    name={colorItem.name}
                    colorBase={colorItem.base}
                    colorLightness={colorItem.lightness}
                    currentColor={color.base}
                    handleChange={setColor} />
            })}
        </>
    )
}

export default ToggleColor