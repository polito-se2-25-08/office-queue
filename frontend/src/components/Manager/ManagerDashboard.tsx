import React from 'react'
import './ManagerDashboard.css'

interface ManagerDashboardProps {
  onBackToRoleSelection: () => void
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onBackToRoleSelection }) => {
  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <h1>📊 Manager Portal</h1>
        <button className="back-button" onClick={onBackToRoleSelection}>
          ← Change Role
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Management Dashboard</h2>
          <p>Monitor statistics and system overview</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Customers Today</h3>
              <div className="stat-number">124</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h3>Average Wait Time</h3>
              <div className="stat-number">8:30</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <h3>Active Counters</h3>
              <div className="stat-number">5/6</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Pending Tickets</h3>
              <div className="stat-number">18</div>
            </div>
          </div>
        </div>
        
        <div className="reports-section">
          <div className="service-stats">
            <h3>Service Statistics</h3>
            <div className="service-breakdown">
              <div className="service-bar">
                <span className="service-label">Package Services</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '65%'}}></div>
                </div>
                <span className="service-percentage">65%</span>
              </div>
              <div className="service-bar">
                <span className="service-label">Financial Services</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '25%'}}></div>
                </div>
                <span className="service-percentage">25%</span>
              </div>
              <div className="service-bar">
                <span className="service-label">Document Services</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '10%'}}></div>
                </div>
                <span className="service-percentage">10%</span>
              </div>
            </div>
          </div>
          
          <div className="counter-performance">
            <h3>Counter Performance</h3>
            <div className="counter-list">
              <div className="counter-item">
                <span className="counter-name">Counter 1</span>
                <span className="counter-served">45 served</span>
                <span className="counter-status active">Active</span>
              </div>
              <div className="counter-item">
                <span className="counter-name">Counter 2</span>
                <span className="counter-served">38 served</span>
                <span className="counter-status active">Active</span>
              </div>
              <div className="counter-item">
                <span className="counter-name">Counter 3</span>
                <span className="counter-served">41 served</span>
                <span className="counter-status inactive">Inactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard