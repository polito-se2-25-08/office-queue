import React from 'react'
import './OfficerDashboard.css'

interface OfficerDashboardProps {
  onBackToRoleSelection: () => void
}

const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ onBackToRoleSelection }) => {
  return (
    <div className="officer-dashboard">
      <div className="dashboard-header">
        <h1>👩‍💼 Officer Portal</h1>
        <button className="back-button" onClick={onBackToRoleSelection}>
          ← Change Role
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Officer Control Panel</h2>
          <p>Serve customers and manage your counter</p>
        </div>
        
        <div className="counter-section">
          <div className="counter-info">
            <h3>Counter Information</h3>
            <div className="counter-details">
              <div className="counter-id">Counter #1</div>
              <div className="counter-status">Ready to Serve</div>
            </div>
          </div>
          
          <div className="next-customer">
            <h3>Next Customer</h3>
            <button className="call-next-button">Call Next Customer</button>
          </div>
          
          <div className="current-serving">
            <h3>Currently Serving</h3>
            <div className="serving-info">
              <div className="ticket-number">Ticket: A001</div>
              <div className="service-type">Service: Package Services</div>
              <button className="complete-button">Complete Service</button>
            </div>
          </div>
        </div>
        
        <div className="queue-overview">
          <h3>Queue Overview</h3>
          <div className="queue-stats">
            <div className="queue-item">
              <span className="queue-service">Package Services</span>
              <span className="queue-count">5 waiting</span>
            </div>
            <div className="queue-item">
              <span className="queue-service">Financial Services</span>
              <span className="queue-count">3 waiting</span>
            </div>
            <div className="queue-item">
              <span className="queue-service">Document Services</span>
              <span className="queue-count">2 waiting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfficerDashboard