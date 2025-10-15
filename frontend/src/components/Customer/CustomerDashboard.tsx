import React, {use, useEffect, useState} from 'react'
import { newTicket, checkTicket } from '../API'
import './CustomerDashboard.css'

interface CustomerDashboardProps {
  onBackToRoleSelection: () => void
}

//ADD THE PAGE THAT INDICATES THE TICKET NUMBER AND DEPENDING IF THE TICKET IS CALLED OR NOT EITHER POLL
//FOR THE TICKETS TAKEN OR SHOW THE DESK TO GO TO

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onBackToRoleSelection }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>👤 Customer Portal</h1>
        <button className="back-button" onClick={onBackToRoleSelection}>
          ← Change Role
        </button>
      </div>

      <div className="dashboard-content">
        {selectedService && <TicketPage service={selectedService} />}
        {!selectedService && 
          <>
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
                  <button className="service-button" onClick={() => { setSelectedService("package"); }}>Get Ticket</button>
                </div>
                
                <div className="service-card">
                  <div className="service-icon">💰</div>
                  <h4>Financial Services</h4>
                  <p>Deposits, withdrawals, payments</p>
                  <button className="service-button" onClick={() => { setSelectedService("financial"); }}>Get Ticket</button>
                </div>
                
                <div className="service-card">
                  <div className="service-icon">📄</div>
                  <h4>Document Services</h4>
                  <p>Certificates, applications</p>
                  <button className="service-button" onClick={() => { setSelectedService("document"); }}>Get Ticket</button>
                </div>
              </div>
            </div>
          </>
        }
        
      </div>
    </div>
  )
}

interface TicketPageProps {
  service: string;
}

const TicketPage: React.FC<TicketPageProps> = ({ service }) =>
{
  const [desk, setDesk] = useState<number | null>(null);
  const [ticket, setTicket] = useState<number | null>(null);
  console.log("Service selected: ", service);
  useEffect(() => {
    //request to backend to get the ticket number
    // newTicket(service).then((data) => {
    //   setTicket(data.ticketNumber);});
      const timer =setTimeout(() => {
          
          setTicket(1)
        }, 5000)
        
        return () => clearTimeout(timer);
  }, []);

  //polling mechanism, to be changed with web socket
  useEffect(() => {
    if(ticket == null)
      return;
    while(desk == null)
    {
        const timer =setTimeout(() => {
          //request to backend to get the desk numbers
          // checkTicket(ticket).then()
          setDesk(1)
        }, 5000)
        
        return () => clearTimeout(timer);
    }
  }, [ticket]);

  return (
    <div>
      <h2 className='welcome-section'>Your Ticket</h2>
      <div className='service-card'>
        <h2>Service: {service}</h2>
        {ticket == null && <h2>Generating your ticket...</h2>}
        {ticket != null && <h2>Ticket Number: {ticket}</h2>}
        {ticket != null && desk == null && <h2>Waiting for desk assignment...</h2>}
        {desk && <h2>Go to Desk: {desk}</h2>}
      </div>
    </div>
  );
}

export default CustomerDashboard