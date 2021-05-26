import {useState} from 'react'
import {Link} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import classname from 'classnames'

import {
  changeTab,
  selectActiveTab
} from '../store/navbarSlice'
import { selectUser } from '../store/authSlice';

function NavbarItem({image, title, index, activeIndex, changeActiveTab, link}){
  return (
    <Link 
      className={
        classname(
          "h-full lg:w-80 bg-gray-500 flex-grow flex items-center justify-center rounded-t-xl", 
          {
            "text-secondary": activeIndex !== index,
            "text-primary bg-secondary": activeIndex === index
        })
      }
      to={`${link}`}
      onClick={() => changeActiveTab(index)}
    >
      <div className="h-full" >
        <img src={`${image}`} title={`${title}`} className="h-full"/>
      </div>
    </Link>
  )
}

function Navbar({items}) {
  const activeTab = useSelector(selectActiveTab)

  const dispatch = useDispatch()

  // Choose which page is active right now
  const [active, setActive] = useState(0)

  const user = useSelector(selectUser)

  function changeActiveTab(tab){
    dispatch(changeTab(tab))
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
                index={items.indexOf(item)}
                activeIndex={activeTab}
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
