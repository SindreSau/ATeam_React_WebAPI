import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

type Props = {}

const MainLayout = (props: Props) => {
  return (
<div className='d-flex flex-column min-vh-100'>
    <NavBar />
    <div className='container-md'>
      <Outlet />
    </div>


    <Footer />
</div>
  )
}

export default MainLayout