import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import {React, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar'
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import {authenticate, selectUser, setToken, selectAuthStatus, loadToken} from './store/authSlice';
import Dashboard from './components/DashboardPage';
import Logout from './components/Logout';
import Create from './components/Create';
import EditCapsule from './components/EditCapsule';
import { fetchProfile } from './store/profileSlice';
import { fetchCapsules, selectCapsules, selectCapsulesIds, selectCapsulesStatus } from './store/capsulesSlice'
import JoinCapsule from './components/JoinCapsule';
import ViewCapsule from './components/ViewCapsule';

function App() {

  const routes = {
    LandingPage: "/home",
    AuthPage: "/auth",
    Dashboard: "/dashboard",
    Create: "/create",
    Edit: "/edit",
    View: "/view",
    Join: "/join",
    Logout: "/logout",
  }

  const dispatch = useDispatch()

  const user = useSelector(selectUser)
  const authStatus = useSelector(selectAuthStatus)

  useEffect(() => {   
    if (!user.access_token){
      dispatch(loadToken())
    } else {
      // Access token has to be available
      dispatch(fetchProfile())
    }
  }, [user.access_token])

  const capsules = useSelector(selectCapsules)
  const capsulesIds = useSelector(selectCapsulesIds)
  const capsulesStatus = useSelector(selectCapsulesStatus)

  useEffect(() => {
    // Fetching capsules is global right now...

    if (!capsulesIds.length && user.access_token){
        if (capsulesStatus !== "pending"){
            dispatch(fetchCapsules())
        }
    } 
  }, [capsules, user.access_token])
  
  // Waiting for token to be fetched
  // Without this we'll be constantly redirected in ProtectedRoute
  // This shall be the MainLoader
  if (authStatus === 'pending'){
    return (
      <div>
        {/* Style later */}
        LOADING :)
      </div>
    )
  }

  return (
    <Router>
      <div className="bg-primary min-h-screen p-6">
        {/* skeleton */}
        <div className="md:w-5/6 m-auto">
          {/* navbar */}
          <div className="h-20 bg-red-100">
            <Navbar
              items={
                [
                  {
                    image: "./logo.png",
                    title: "Time Capsulator",
                    link: routes.LandingPage,
                    authState: 0  // 0 for unauth only, 1 for auth, 2 for both
                  },

                  {
                    image: "./logo.png",
                    title: "Dashboard",
                    link: routes.Dashboard,
                    authState: 1
                  },

                  {
                    image: "./logo.png",
                    title: "Authentication",
                    link: routes.AuthPage,
                    authState: 0
                  },

                  {
                    image: "./logo.png",
                    title: "Create",
                    link: routes.Create,
                    authState: 1
                  },
                  {
                    image: "./logo.png",
                    title: "Join",
                    link: routes.Join,
                    authState: 1
                  },
                  {
                    image: "./logo.png",
                    title: "Logout",
                    link: routes.Logout,
                    authState: 1
                  },

                  
                ]
              }
            ></Navbar>
          </div>
          {/* body */}
          <div className="rounded-b-2xl h-full">
            {/* Routing */}
              <Switch>
                <Route path={`${routes.AuthPage}`} component={AuthPage} />
                <ProtectedRoute exact={true} path={`${routes.LandingPage}`} component={LandingPage} redirection={`${routes.Dashboard}`} authRequired={false}  />
                <ProtectedRoute path={`${routes.Dashboard}`} component={Dashboard} redirection={`${routes.LandingPage}`}/>
                <ProtectedRoute path={`${routes.Logout}`} component={Logout} redirection={`${routes.AuthPage}`}/>
                <ProtectedRoute path={`${routes.Create}`} component={Create} redirection={`${routes.AuthPage}`}/>
                <ProtectedRoute path={`${routes.Edit}/:id`} component={EditCapsule} redirection={`${routes.AuthPage}`}/>
                <ProtectedRoute path={`${routes.View}/:id`} component={ViewCapsule} redirection={`${routes.AuthPage}`}/>
                <ProtectedRoute path={`${routes.Join}`} component={JoinCapsule} redirection={`${routes.AuthPage}`}/>
              </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
