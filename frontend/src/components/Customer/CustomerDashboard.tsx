import React from 'react'
import './CustomerDashboard.css'

interface CustomerDashboardProps {
  onBackToRoleSelection: () => void
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onBackToRoleSelection }) => {
  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>👤 Customer Portal</h1>
        <button className="back-button" onClick={onBackToRoleSelection}>
          ← Change Role
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to Office Queue Management</h2>
          <p>Request services and receive your queue ticket</p>
        </div>
        
        <div className="service-section">
          <h3>Available Services</h3>
          <div className="service-grid">
            <div className="service-card">
              <div className="service-icon">📦</div>
              <h4>Package Services</h4>
              <p>Send packages, registered mail</p>
              <button className="service-button">Get Ticket</button>
            </div>
            
            <div className="service-card">
              <div className="service-icon">💰</div>
              <h4>Financial Services</h4>
              <p>Deposits, withdrawals, payments</p>
              <button className="service-button">Get Ticket</button>
            </div>
            
            <div className="service-card">
              <div className="service-icon">📄</div>
              <h4>Document Services</h4>
              <p>Certificates, applications</p>
              <button className="service-button">Get Ticket</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard