import { useState } from "react";
import { useNavigate } from "react-router-dom";
const styleClass = "h-[60px] text-sm w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-primary border-2 border-secondary p-4 ring-blue-700 hover:ring-2 flex gap-2";

function Login() {
    const [name, setName] = useState("")

    const navigate = useNavigate()
    const handleLogin = () => {
        localStorage.setItem('kanbanAdmin', JSON.stringify(name))
        navigate('/my-task')
    }
    return (
        <div className='flex bg-primary items-center justify-center min-h-screen '>
            <div className='bg-secondary h-[280px] px-4 py-6 flex gap-3 flex-col items-center rounded-lg' >
                <h1>Welcome to Your Kanban Board</h1>
                <div className="mt-4 flex flex-col gap-4">
                    <input value={name} onChange={(e) => setName(e.target.value)} type='text' autoFocus className={styleClass} placeholder="Please enter your name" />
                    <button disabled={!name} className={`${styleClass}  ${!name && 'bg-[#444] opacity-30 cursor-not-allowed'} flex justify-center text-center text-md`} onClick={handleLogin}>Continue</button>

                </div>
            </div>
        </div >
    )
}

export default Login