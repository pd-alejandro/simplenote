export const ripple = (e) => {
    try {
        const btn = e.currentTarget
        const rect = btn.getBoundingClientRect()
        const btnX = e.clientX - rect.left
        const btnY = e.clientY - rect.top

        const currentBtn = e.currentTarget
        currentBtn.style.setProperty("--btn-y", `${btnY}px`)
        currentBtn.style.setProperty("--btn-x", `${btnX}px`)

        // create and add el to DOM
        let ripple = document.createElement("span")
        ripple.classList.add("ripple")
        currentBtn.appendChild(ripple)

        // remove element (after animation)
        setTimeout(() => {
            ripple.remove()
        }, 300)
    } catch (e) { console.log(e) }
}
