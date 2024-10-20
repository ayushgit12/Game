import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Gamepage from './managers/Gamepage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Gamepage />
    </>
  )
}

export default App
