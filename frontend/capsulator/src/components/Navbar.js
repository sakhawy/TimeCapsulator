import {useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
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
            "text-secondary": activeTab !== link,
            "text-primary bg-secondary": activeTab === link
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

  // Choose which page is active right now
  const [activeTab, setActiveTab] = useState(null)

  // Needed for choosing wheather we're keeping or ditching the tab 
  const user = useSelector(selectUser)

  const history = useHistory()

  useEffect(() => {
    setActiveTab(history.location.pathname)
  }, [history.location.pathname])

  function changeActiveTab(tab){
    setActiveTab(tab)
  }
  
  return (
    <nav className="h-full">
        <div className="flex overflow-hidden h-full relative">
          
          {/* Create items programatically */}
          {items.map(item => {
            if (
              item.authState === 2 || // item is displayed for both authed and unauthed
              (
                user.access_token && item.authState === 1 ||  // item is only displayed for authed
                !user.access_token && item.authState === 0  // item is only displayed for unauthed
              )
            )
              return <NavbarItem
                image={item.image}
                title={item.title}
                activeTab={activeTab}
                changeActiveTab={changeActiveTab}
                link={item.link}
                key={items.indexOf(item)}
              />
          })}

        </div>
      </nav>
  )
}

export default Navbar
