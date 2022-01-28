import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {Route, Redirect, useHistory} from 'react-router-dom'

import {selectUser} from '../store/authSlice'

function ProtectedRoute({path, redirection, component: Component, authRequired=true}) {
    const user = useSelector(selectUser) 
    const history = useHistory()
    return (
        <Route path={path} render={() => {
            // Got this from the truth table 
            if ((user.access_token && authRequired) ||  // For protect auth
                !user.access_token && !authRequired     // For protected unauth
            ){
                return <Component />
            }
            else {
                return <Redirect to={
                    {
                        pathname: redirection,
                        state: {referrer: history.location.pathname}
                    }
                }/>
                
            }
        }}/>
        
    )
}

export default ProtectedRoute
