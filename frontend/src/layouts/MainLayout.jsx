import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-1 fw-semibold">HelpNest</p>

          <p className="mb-0 text-white-50">
            Helping people grow, together.
          </p>
        </div>
      </footer>
    </>
  )
}

export default MainLayout