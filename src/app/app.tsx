import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Login } from './pages/Login'
import { Emails } from './pages/Emails'
import { Settings } from './pages/Settings'

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const token = localStorage.getItem('token')
  return token ? <Component /> : <Navigate to="/login" replace />
}

export function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsReady(true)
      return
    }

    setIsReady(true)
  }, [])

  if (!isReady) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/emails" element={<ProtectedRoute component={Emails} />} />
        <Route path="/settings" element={<ProtectedRoute component={Settings} />} />
        <Route path="/" element={<Navigate to="/emails" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
