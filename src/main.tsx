import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import MainView from './pages/main-view'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Todos from './pages/todos'
import Review from './pages/review'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <Routes>
      <Route path="/" element={<MainView />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/todos" element={<Todos />} />
      <Route path="/review" element={<Review />} />
    </Routes>
  </StrictMode>
  </BrowserRouter>
)
