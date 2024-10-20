import { useState } from 'react'
import './App.css'
import Gamepage from './managers/Gamepage'
import LandingPage from './managers/Landingpage'
import { Routes, Route } from 'react-router-dom'
import Gamesettings from './managers/Gamesettingspage'
import Com from './Api/Com'
import Rapid from './managers/Rapid'

function App() {
  const [count, setCount] = useState(0)

  return (

      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<Gamepage />} />
        <Route path="/gamesettings" element={<Gamesettings />} />
        <Route path='/com' element={<Com/>}/>
        <Route path='/rapid' element={<Rapid />}/>
      </Routes>

  );
}

export default App
