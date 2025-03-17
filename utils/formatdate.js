const oneDay = 24 * 60 * 60 * 1000

const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yy = String(date.getFullYear()).slice(-2)
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')

    let days = (new Date - date) / oneDay

    let output

    if (days < 1) {
        let hours = days * 24

        if (hours < 1) {
            let minutes = hours * 60

            if (minutes < 1) {
                output = 'just now'
            } else {
                minutes = Math.floor(minutes)
                output = `${minutes} minute${minutes === 1 ? '' : 's'} ago`
            }

        } else {
            hours = Math.floor(hours)
            output = `${hours} hour${hours === 1 ? '' : 's'} ago`
        }

    } else if (days < 2) {
        output = `yesterday, ${hh}:${min}`
    } else if (days < 7) {
        days = Math.floor(days)
        output = `${days} days ago`
    } else {
        output = `${dd}/${mm}/${yy}, ${hh}:${min}`
    }

    return output
}

export default formatDate