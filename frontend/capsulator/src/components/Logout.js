import { useDispatch } from "react-redux"
import { useHistory } from "react-router"
import { logout } from "../store/authSlice"

export default function Logout() {
    
    const history = useHistory()

    const dispatch = useDispatch()

    function handleLogout(){
        dispatch(logout())
    }
    
    return (
        <div className="flex flex-col bg-secondary items-center justify-center h-64 sm:min-h-0 rounded-b-2xl p-4">
            <button 
                className="rounded-md bg-primary text-secondary h-16 w-48 font-bold text-2xl"
                onClick={() => handleLogout()}    
            >Logout</button>
        </div>
    )
}
