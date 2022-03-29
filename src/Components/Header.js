import React, { useState, useEffect } from "react"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import axios from "axios"
import { Link } from "react-router-dom"
import MenuIcon from "@material-ui/icons/Menu"
import { SideBarData } from "./SidebarData"

function HeaderMenuItem({ item_data }) {
  return (
    <div className='menu-item'>
      {item_data.title.toUpperCase()}

      {item_data.items && <KeyboardArrowDownIcon />}

      {item_data.items && (
        <div className='popup-menu'>
          {item_data.items.map((i) => (
            <a key={i} className='popup-items'>
              {i}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function HeaderMenu() {
  const [menu_list, set_menu_list] = useState([])

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/categories`,
    }).then((res) => set_menu_list(res.data))
  }, [])

  return (
    <div className='menu'>
      {menu_list.map((item_data) => {
        return <HeaderMenuItem key={item_data.id} item_data={item_data} />
      })}
    </div>
  )
}


function Header() {
  const [site_info, set_site_info] = useState([])

  const fetch_site_info = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/site_info`,
    }).then((res) => set_site_info(res.data))
  }

  useEffect(() => {
    fetch_site_info()
  }, [])



  return (
    <div className='header-container'>
       <div className="navigation">
            <div className="menu-container">
                <HeaderMenu />
          </div>

      <div className='button-wrapper'>
        <button className='button'>Sign up</button>
        <button className='button'>Create Account</button>
      </div>
       </div>


      <div className="base-sidebar-container">
        <SideBar />
      </div>
    </div>
  )
}
 
function SidebarSubMenu({item}) {
  const [subNav, setSubNav] = useState(false)

  const showSubNavCategories = () => {
    setSubNav(!subNav)
  }

  return (
    <>
    <div>
      {item.icon}
      <button onClick={item.subCategory && showSubNavCategories}>{item.name}</button>
    </div>
    <div>
      {
      item.subCategory && subNav
      ? item.openedIcon
      : item.subCategory
      ? item.closedIcon
      :null
      }
    </div>
    <div>
      {
        subNav && item.subCategory.map((item, index) => {
          return (
          <div key={index}>{item.title}</div>
          )
        })
      }
    </div> 
    </>
  )
}

function SideBarContent() {
 

 return (
      <>
           <ul>
            {SideBarData.map((item, index) => {
               return <SidebarSubMenu item={item} key={index} /> 
            })}
           </ul>
      </>
  )
}

function SideBar() {
  const [sidebar, setSideBar] = useState(false)



  return (
    <div className="sidebar-container">
       <MenuIcon onClick={() => setSideBar(!sidebar)}/>
      {sidebar && <SideBarContent />}
    </div>
  )
}

export default Header