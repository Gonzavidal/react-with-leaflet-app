import React from 'react'
import Map from './Map'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Map />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App