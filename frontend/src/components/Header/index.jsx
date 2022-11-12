import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IAvatar } from '../../utils/icons'
import Dropdown from '../Dropdown.jsx'
import Profile from '../Profile'

import "./index.css"

export default function Header({userData=false}) {
  const location = useLocation()

  const [user, setUser] = useState({})
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    if(localStorage.getItem("user")) setUser(JSON.parse(localStorage.getItem("user")))
    else setUser(userData)

  },[userData])

  return (
    <div>
      <nav>
        <div className="navbar flex sm:justify-between justify-center flex-wrap items-center">
          <h2>EMPRESS VLOG</h2>

          {location.pathname === "/" || location.pathname === "/signup" ?
          <ul className="sm:ml-0 ml-5 nav-list flex">
<li className="nav-item"><Link to={"/about"}>About</Link></li>

            <li className="nav-item"><Link to={"/contact"}> Contact</Link></li>
          </ul>
          :
          <ul className="nav-list items-center flex">
            <li className="nav-item"><Link to={"/posts"}> Posts </Link></li>

            {user.role !=="user" && <li className="nav-item"><Link to={"/create"}>Create</Link></li>}

            <li className="nav-item ml-10">
            <Dropdown {...{setOpen}}>
              <span className='flex mr-5 items-center'> 
            <img src={IAvatar} className="rounded-full w-8 h-8 mr-3" /> <div><small>Welcome,</small><small className='block'>{user.firstName || "User"}</small></div>
            </span>
            </Dropdown>
            </li>
          </ul>
          }
        </div>
      </nav>

      <Profile {...{open, setOpen, setUser }} />
    </div>
  )
}
