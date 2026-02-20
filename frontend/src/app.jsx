import { useEffect, useState } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import axios from "axios"

import Home from "./pages/home.jsx"
import Dashboard from "./pages/dashboard.jsx"

export default function App () {
    return ( 
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </HashRouter>
    )
}