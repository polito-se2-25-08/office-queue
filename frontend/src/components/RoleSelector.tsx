import { useState } from 'react'
import './RoleSelector.css'

export type UserRole = 'customer' | 'officer' | 'manager'

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const roles = [
    {
      id: 'customer' as UserRole,
      title: 'Customer',
      description: 'Request services and receive tickets',
      icon: '👤',
      color: '#0066cc'
    },
    {
      id: 'officer' as UserRole,
      title: 'Officer',
      description: 'Serve customers at service counters',
      icon: '👩‍💼',
      color: '#28a745'
    },
    {
      id: 'manager' as UserRole,
      title: 'Manager',
      description: 'View statistics and manage the system',
      icon: '📊',
      color: '#dc3545'
    }
  ]

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole)
    }
  }

  return (
    <div className="role-selector">
      <div className="role-selector-container">
        <div className="role-selector-header">
          <h1>Office Queue Management System</h1>
          <p>Choose your role to continue</p>
        </div>

        <div className="roles-grid">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
              onClick={() => handleRoleSelect(role.id)}
              style={{ '--role-color': role.color } as React.CSSProperties}
            >
              <div className="role-icon">{role.icon}</div>
              <h3 className="role-title">{role.title}</h3>
              <p className="role-description">{role.description}</p>
              {selectedRole === role.id && (
                <div className="role-selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>

        {selectedRole && (
          <div className="continue-section">
            <button 
              className="continue-button"
              onClick={handleContinue}
            >
              Continue as {roles.find(r => r.id === selectedRole)?.title}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleSelector