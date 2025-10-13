import { useState } from 'react'
import RoleSelector from './components/RoleSelector'
import type { UserRole } from './components/RoleSelector'
import CustomerDashboard from './components/Customer/CustomerDashboard'
import OfficerDashboard from './components/Officer/OfficerDashboard'
import ManagerDashboard from './components/Manager/ManagerDashboard'
import './App.css'

function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleBackToRoleSelection = () => {
    setSelectedRole(null)
  }

  const renderDashboard = () => {
    switch (selectedRole) {
      case 'customer':
        return <CustomerDashboard onBackToRoleSelection={handleBackToRoleSelection} />
      case 'officer':
        return <OfficerDashboard onBackToRoleSelection={handleBackToRoleSelection} />
      case 'manager':
        return <ManagerDashboard onBackToRoleSelection={handleBackToRoleSelection} />
      default:
        return <RoleSelector onRoleSelect={handleRoleSelect} />
    }
  }

  return <>{renderDashboard()}</>
}

export default App
