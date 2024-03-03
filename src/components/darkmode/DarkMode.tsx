
import MoonIcon from '../icons/MoonIcon'
import SunIcon from '../icons/SunIcon'
interface Prop {
    handleDarkMode: () => void
}
const DarkMode = ({ handleDarkMode }: Prop) => {

    const handleChange = (event: { target: { checked: boolean; }; }) => {
        console.log(event.target.checked)
        handleDarkMode()
    }
    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={handleChange}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <SunIcon />
                <MoonIcon />
            </label>
        </div>
    );
};

export default DarkMode;
