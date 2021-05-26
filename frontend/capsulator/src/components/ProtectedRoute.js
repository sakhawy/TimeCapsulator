import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {Route, Redirect} from 'react-router-dom'

import {selectUser} from '../store/authSlice'

function ProtectedRoute(props) {
    const user = useSelector(selectUser) 
    return (
        <div>
            {user.access_token && <Route {...props}/> }
            
            {!user.access_token && <Redirect to={props.redirection} />}
            
        </div>
    )
}

export default ProtectedRoute
