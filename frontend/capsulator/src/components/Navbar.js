import {useState} from 'react'
import {Link} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import classname from 'classnames'

import {
  changeTab,
  selectActiveTab
} from '../store/navbarSlice'

function Navbar() {
  const activeTab = useSelector(selectActiveTab)

  const dispatch = useDispatch()

  // Choose which page is active right now
  const [active, setActive] = useState(0)

  function changeActiveTab(tab){
    dispatch(changeTab(tab))
  }

  return (
      <nav class="h-full">
        <div class="flex overflow-hidden h-full ">
          <div class={
            classname(
              "h-full lg:w-80 bg-gray-500 flex-grow flex items-center justify-center rounded-t-xl", 
              {
                "text-secondary": activeTab !== 0,
                "text-primary bg-secondary": activeTab === 0
            })
          }>
            <Link to="/" className="h-full" onClick={() => changeActiveTab(0)}>
              <img src="./logo.png" alt="" className="h-full"/>
            </Link>
          </div>
          <div class={
            classname(
              "h-full lg:w-80 bg-gray-500 flex-grow flex items-center justify-center rounded-t-xl", 
              {
                "text-secondary": activeTab !== 1,
                "text-primary bg-secondary": activeTab === 1
            })
          }>
            <Link to="/create" class=" text-2xl md:text-4xl font-bold" onClick={() => changeActiveTab(1)}>Logo</Link>
          </div>
          <div class={
            classname(
              "h-full lg:w-80 bg-gray-500 flex-grow flex items-center justify-center rounded-t-xl", 
              {
                "text-secondary": activeTab !== 2,
                "text-primary bg-secondary": activeTab === 2
            })
          }>
            <Link to="/account" class=" text-2xl md:text-4xl font-bold" onClick={() => changeActiveTab(2)}>Logo</Link>
          </div>

        </div>
      </nav>
  )
}

export default Navbar
