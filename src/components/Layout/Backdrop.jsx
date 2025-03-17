export default function Backdrop({ toggleNav }) {
    return (
        <div
            className="backdrop"
            onClick={toggleNav}
            role="button"
            aria-hidden={true}></div>
    )
}