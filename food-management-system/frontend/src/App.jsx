/**
 * App.jsx
 * --------
 * Root component. Defines the Navbar (always visible) and
 * the page routes using React Router DOM.
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import FoodList from './pages/FoodList'
import AddFood from './pages/AddFood'
import EditFood from './pages/EditFood'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/foods" element={<FoodList />} />
        <Route path="/add" element={<AddFood />} />
        <Route path="/edit/:id" element={<EditFood />} />
        <Route
          path="*"
          element={
            <div className="container py-5 text-center">
              <h2>404 - Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </>
  )
}

export default App
