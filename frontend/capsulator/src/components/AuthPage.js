import {useDispatch, useSelector} from 'react-redux'
import GoogleLogin from 'react-google-login'

import {authenticate, selectUser} from '../store/authSlice'
import { Redirect, useHistory } from 'react-router'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab, faGoogle } from '@fortawesome/free-brands-svg-icons'

function AuthPage() {

    const dispatch = useDispatch()

    const history = useHistory()
    
    const user = useSelector(selectUser)

    useEffect(() => {
        // Do this after the authentication dispatch
        // NOTE: This won't work if the user changed directory before login is done

        if (user.access_token){
            history.push("/dashboard")
        }
    }, [user])


    function loginSuccess(response){
        // dispatch(authenticate(response))
        dispatch(authenticate({
            code: response.tokenId
        }))
    }

    function loginFailure(response){
    }

    return (
        <div className="flex flex-col space-y-2 bg-secondary items-center justify-center sm:min-h-0 rounded-b-2xl p-4">
            <div className="flex-grow flex justify-center items-center">    
                <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary ">Sign Up - Login</h1>
            </div>
            <div className="flex-grow w-full h-16">
                <GoogleLogin 
                    clientId="354605905259-6ip0oar2l4prc4pg7fbktcu0771ibqm5.apps.googleusercontent.com"
                    render={props => (
                        <button 
                            onClick={props.onClick} 
                            disabled={props.disabled} 
                            className="rounded-md bg-primary text-secondary min-w-full min-h-full font-bold text-2xl h-16"
                        >
                            <div className="h-full w-full flex items-center justify-center space-x-2">
                                <p>
                                    With <FontAwesomeIcon icon={faGoogle}/>oogle
                                </p>
                            </div>
                        </button>
                    )}
                    accessType="offline"
                    onSuccess={loginSuccess}
                    onFailure={loginFailure} 
                    cookiePolicy={'single_host_origin'}

                />
            </div>

            <div className="flex-grow flex justify-center items-center">
                <p className="text-primary text-xs font-semibold md:text-sm text-center">
                    Make sure that you use a google account that you'll likely be using for a few more years because the Time Capsule notification emails will be sent there.
                </p>
            </div>
        </div>
    )
}

export default AuthPage
