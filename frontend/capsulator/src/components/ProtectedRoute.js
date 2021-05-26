import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {Route, Redirect} from 'react-router-dom'

import {selectUser} from '../store/authSlice'

function ProtectedRoute({redirection, component: Component}) {
    const user = useSelector(selectUser) 
    return (
        <Route render={() => {
            if (!user.access_token){
                return <Redirect to={redirection} />
            }   
            else{ 
                return <Component />
            }
        }}/>
        
    )
}

export default ProtectedRoute
