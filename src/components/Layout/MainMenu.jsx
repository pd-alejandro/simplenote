import ToggleColor from './ToggleColor'
import ToggleTheme from './ToggleTheme'

const MainMenu = ({ navOpen }) => {

    return (
        <nav
            className={`menu--${navOpen ? 'opened' : 'closed'}`}
            id="main-menu">
            <ul>
                <li
                    id="theme-sets"
                    className="menu-item">
                    <div
                        className="menu-item__name">
                        Theme
                    </div>
                    <div className="flex-row">
                        <ToggleTheme />
                    </div>
                </li>
                <li
                    id="color-sets"
                    className="menu-item">
                    <div
                        className="menu-item__name">
                        Color
                    </div>
                    <div className="flex-row">
                        <ToggleColor />
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default MainMenu