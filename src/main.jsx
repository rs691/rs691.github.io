import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'

import Tutoring from './pages/Tutoring.jsx'
import Awards from './pages/Awards.jsx'

import Contact from './pages/Contact.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import Test from './pages/Test.jsx'


import { createHashRouter, RouterProvider } from 'react-router-dom'


const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/projects/:id',
    element: <Projects />,
  },
  {
    path: '/tutoring',
    element: <Tutoring />,
  },
  {
    path: '/awards',
    element: <Awards />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
     <RouterProvider router={router} />
    
  </StrictMode>,
)
