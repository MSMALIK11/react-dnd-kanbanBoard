import { useEffect, useState } from 'react'
import HomeIcon from '../components/icons/HomeIcon'
import LogoutIcon from '../components/icons/LogoutIcon'
import FullScreenIcon from '../components/icons/FullScreenIcon'
import DarkMode from './darkmode/DarkMode'
import { useNavigate } from 'react-router-dom'
import Button from './shared/Button'
interface Prop {
    handleDarkMode: () => void
    createNewColumn: () => void
}
const getNamePersona = (name: string) => {
    if (!name) return 'S'
    const firstLeter = name.split('')[0].toLocaleUpperCase()
    if (firstLeter) return firstLeter
}
function Header({ handleDarkMode, createNewColumn }: Prop) {
    const [name, setName] = useState("")
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('kanbanAdmin')
        localStorage.removeItem('kanbanBoard')
        navigate('/')
    }
    useEffect(() => {
        const userName = localStorage.getItem('kanbanAdmin')
        if (userName) {

            const word = getNamePersona(JSON.parse(userName))
            if (word) {
                setName(word)
            }
        }

    }, [])

    const onClickFullScreen = (): void => {
        if (!document.fullscreenElement) {
            void document.documentElement.requestFullscreen()
        } else if (document.exitFullscreen) {
            void document.exitFullscreen()
        }
    }


    return (
        <div className='flex items-center bg-white dark:bg-primary'>
            <div className='text-white  w-full   bg-gray-100 shadow-lg dark:bg-secondary sahdow-md rounded-lg  py-1 lg:px-12 md:px-6 sm:px-2 flex justify-between items-center '>
                <div className='flex gap-4 items-center'><div className='dark:bg-primary bg-white p-2 rounded-full '><HomeIcon /></div> <h1 className='text-gray-900 hidden lg:d-block  md:block dark:text-white'> ⭐ Barcadly Services </h1></div>
                <div className='flex gap-4 items-center' id="header-navigation">
                    <Button label='New Board' onClick={createNewColumn} />
                    <DarkMode handleDarkMode={handleDarkMode} />
                    <div onClick={onClickFullScreen} title='Full Screen' className='cursor-pointer'>
                        <FullScreenIcon />
                    </div>
                    <div onClick={handleLogout} className='cursor-pointer' title='logout'>
                        <LogoutIcon />
                    </div>
                    <div id='persona' className='w-[30px] h-[30px] rounded-full bg-blue-700 dark:bg-secondary flex items-center justify-center relative'>{name}</div>

                </div>
            </div>
        </div>
    )
}

export default Header