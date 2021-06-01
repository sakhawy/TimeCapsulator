import {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from "react-router-dom";
import {useSelector} from 'react-redux'
import classname from 'classnames'

import { selectUser } from '../store/authSlice';

function NavbarItem({image, title, activeTab, changeActiveTab, link}){
  return (
    <Link 
      className={
        classname(
          "h-full lg:w-80 bg-gray-500 flex-grow flex items-center justify-center rounded-t-xl", 
          {
            "text-secondary": !(activeTab.includes(link)),
            "text-primary bg-secondary": activeTab.includes(link)
        })
      }
      to={`${link}`}
      onClick={() => changeActiveTab(link)}
    >
      <div className="h-full" >
        <img src={`${image}`} title={`${title}`} className="h-full"/>
      </div>
    </Link>
  )
}

function Navbar({items}) {
  /*
  The Navbar will highlight items based on
  - The link is in the current path (e.g. link: dashboard/, path dashboard/bingus/)
  - The previous highlighted path (for non-navbar link)
  - The final fallback: Dashboard's path
  */

  // Choose which page is active right now
  const [activeTab, setActiveTab] = useState(null)

  // Needed for choosing wheather we're keeping or ditching the tab 
  const user = useSelector(selectUser)

  const location = useLocation()

  useEffect(() => {
    // Set the active tab if the current url is in the item's list of links (preserve previous state)
    if (items.filter(item => isAuthorized(item) && location.pathname.includes(item.link)).length > 0){
      setActiveTab(location.pathname)
    }
    else {
      // Fallback to 'Dashboard'
      setActiveTab('/dashboard')
    }
    }, [location.pathname])

  function isAuthorized(item){
    // Check if the tab can appear on the current user's auth state (some tabs are disabled for authed users others appears for both auth and unauth)
    //      A+B                                                         AB + A'B' 
    if (item.authState === 2 || (user.access_token && item.authState === 1 || !user.access_token && item.authState === 0)){
      return true
    }
    return false
  }

  function changeActiveTab(link){
    // preserve previous state
    if (activeTab.includes(link)){
      setActiveTab(link)
    }
  }
  
  return (
    <nav className="h-full">
        <div className="flex overflow-hidden h-full relative">
          
          {activeTab &&
            items.map(item => {
              if (isAuthorized(item))
                  return <NavbarItem
                  image={item.image}
                  title={item.title}
                  activeTab={activeTab}
                  changeActiveTab={changeActiveTab}
                  link={item.link}
                  key={items.indexOf(item)}
                  />
                })
          }

        </div>
      </nav>
  )
}

export default Navbar
