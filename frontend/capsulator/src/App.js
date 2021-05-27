import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import {React, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar'
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import {authenticate, selectUser, setToken, selectAuthStatus} from './store/authSlice';
import Dashboard from './components/DashboardPage';
import Logout from './components/Logout';

function App() {

  const routes = {
    LandingPage: "/",
    AuthPage: "/auth",
    Dashboard: "/dashboard",
    Logout: "/logout"
  }

  const dispatch = useDispatch()

  const user = useSelector(selectUser)
  const authStatus = useSelector(selectAuthStatus)

  useEffect(() => {   
    dispatch(authenticate({token: null}))
  }, [])

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
                <Route exact={true} path={`${routes.LandingPage}`} component={LandingPage} />
                <ProtectedRoute path={`${routes.Dashboard}`} component={Dashboard} redirection={`${routes.LandingPage}`}/>
                <ProtectedRoute path={`${routes.Logout}`} component={Logout} redirection={`${routes.AuthPage}`}/>
              </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
