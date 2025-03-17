import { useState } from 'react'
import Backdrop from './components/Layout/Backdrop'
import MainLayout from './components/Layout/MainLayout'
import MainMenu from './components/Layout/MainMenu'
import MenuButton from './components/Layout/MenuButton'
import Header from './components/Layout/Header'
import './styles/App.css'

export default function App() {

    let [navOpen, setNavOpen] = useState(false)

    const toggleNav = () => {
        setNavOpen(prevNavOpen => !prevNavOpen)
    }

    return (
        <>
            <Header />
            <MenuButton isOpen={navOpen} toggleNav={toggleNav} />
            <MainMenu navOpen={navOpen} />
            <Backdrop toggleNav={toggleNav} />
            <MainLayout navOpen={navOpen} />
        </>
    )
}