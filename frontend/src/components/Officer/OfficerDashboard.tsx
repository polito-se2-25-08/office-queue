import React, { useState, useEffect } from 'react'
import './OfficerDashboard.css'

interface OfficerDashboardProps {
  onBackToRoleSelection: () => void
}

interface Ticket {
  number: number
  service_id: number
  status: string
  desk_id?: number
}

interface QueueStatus {
  service_id: number
  waiting_count: number
  service_name: string
}

interface CurrentServing {
  ticket: Ticket | null
  desk_id: number
  service_name: string | null
}

const API_BASE_URL = 'http://localhost:3000'

const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ onBackToRoleSelection }) => {
  const [deskId] = useState(1) // For now, we'll use desk 1
  const [currentServing, setCurrentServing] = useState<CurrentServing | null>(null)
  const [queueStatus, setQueueStatus] = useState<QueueStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch current serving ticket and queue status
  const fetchData = async () => {
    try {
      // Get current serving ticket
      const currentResponse = await fetch(`${API_BASE_URL}/desk/${deskId}/current`)
      if (currentResponse.ok) {
        const currentData = await currentResponse.json()
        setCurrentServing(currentData.success ? currentData.data : null)
      }

      // Get queue status
      const queueResponse = await fetch(`${API_BASE_URL}/queue/status`)
      if (queueResponse.ok) {
        const queueData = await queueResponse.json()
        setQueueStatus(queueData.success ? queueData.data : [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage('Error fetching data')
    }
  }

  // Call next customer
  const callNextCustomer = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/desk/${deskId}/call-next`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setMessage(`Ticket ${data.data.ticket.number} called to Counter ${deskId}`)
        await fetchData() // Refresh data
      } else {
        setMessage(data.message || 'No tickets waiting in queue')
      }
    } catch (error) {
      console.error('Error calling next customer:', error)
      setMessage('Error calling next customer')
    } finally {
      setLoading(false)
    }
  }

  // Complete current service
  const completeService = async () => {
    if (!currentServing?.ticket) return
    
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/desk/${deskId}/complete`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setMessage(`Ticket ${data.data.completed_ticket} completed`)
        await fetchData() // Refresh data
      } else {
        setMessage(data.error || 'Error completing service')
      }
    } catch (error) {
      console.error('Error completing service:', error)
      setMessage('Error completing service')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and set up polling
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [deskId])

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
          {message && (
            <div className="message-alert">
              {message}
            </div>
          )}
        </div>
        
        <div className="counter-section">
          <div className="counter-info">
            <h3>Counter Information</h3>
            <div className="counter-details">
              <div className="counter-id">Counter #{deskId}</div>
              <div className="counter-status">
                {currentServing?.ticket ? 'Serving Customer' : 'Ready to Serve'}
              </div>
            </div>
          </div>
          
          <div className="next-customer">
            <h3>Next Customer</h3>
            <button 
              className="call-next-button" 
              onClick={callNextCustomer}
              disabled={loading || !!currentServing?.ticket}
            >
              {loading ? 'Calling...' : 'Call Next Customer'}
            </button>
          </div>
          
          <div className="current-serving">
            <h3>Currently Serving</h3>
            {currentServing?.ticket ? (
              <div className="serving-info">
                <div className="ticket-number">Ticket: #{currentServing.ticket.number}</div>
                <div className="service-type">Service: {currentServing.service_name}</div>
                <button 
                  className="complete-button" 
                  onClick={completeService}
                  disabled={loading}
                >
                  {loading ? 'Completing...' : 'Complete Service'}
                </button>
              </div>
            ) : (
              <div className="no-serving">
                <p>No customer currently being served</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="queue-overview">
          <h3>Queue Overview</h3>
          <div className="queue-stats">
            {queueStatus.length > 0 ? (
              queueStatus.map((queue) => (
                <div key={queue.service_id} className="queue-item">
                  <span className="queue-service">{queue.service_name}</span>
                  <span className="queue-count">{queue.waiting_count} waiting</span>
                </div>
              ))
            ) : (
              <div className="queue-item">
                <span className="queue-service">All queues empty</span>
                <span className="queue-count">0 waiting</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfficerDashboard