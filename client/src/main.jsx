import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './Appp.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import AuthBootstrap from './components/AuthBootstrap.jsx'
import AppShell from './pages/AppShell.jsx'
import Marketplace from './pages/Marketplace.jsx'
import EmployeeProfile from './pages/EmployeeProfile.jsx'
import Hire from './pages/Hire.jsx'
import Workspace from './pages/Workspace.jsx'
import Guidance from './pages/Guidance.jsx'
import CLI from './pages/CLI.jsx'
import MyAgents from './pages/MyAgents.jsx'
import Account from './pages/Account.jsx'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrap>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes */}
          <Route element={<RequireAuth />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="/app/marketplace" replace />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="employees/:id" element={<EmployeeProfile />} />
              <Route path="hire/:id" element={<Hire />} />
              <Route path="workspace/:sessionId" element={<Workspace />} />
              <Route path="guidance" element={<Guidance />} />
              <Route path="cli" element={<CLI />} />
              <Route path="my-agents" element={<MyAgents />} />
              <Route path="account" element={<Account />} />
            </Route>
          </Route>
        </Routes>
        </AuthBootstrap>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
