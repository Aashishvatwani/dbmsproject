import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FrontPage from './components/Frontpage'
import { Outlet } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  
  return (
    <>
      <main>
         
          <Outlet/>
        </main>
      
    </>
  )
}

export default App
