import React, { useEffect, useState } from "react";
import { newTicket, checkTicket } from "../API";
import "./CustomerDashboard.css";

interface CustomerDashboardProps {
	onBackToRoleSelection: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
	onBackToRoleSelection,
}) => {
	const [selectedService, setSelectedService] = useState<string | null>(null);
	const [selectedServiceId, setSelectedServiceId] = useState<number>(-1);

	return (
		<div className="customer-dashboard">
			<div className="dashboard-header">
				<h1>👤 Customer Portal</h1>
				<button className="back-button" onClick={onBackToRoleSelection}>
					← Change Role
				</button>
			</div>

			<div className="dashboard-content">
				<TicketPage
					selectedServiceId={selectedServiceId}
					service={selectedService}
				/>

				{!selectedService && (
					<>
						<div className="welcome-section">
							<h2>Welcome to Office Queue Management</h2>
							<p>
								Request services and receive your queue ticket
							</p>
						</div>

						<div className="service-section">
							<h3>Available Services</h3>
							<div className="service-grid">
								<div className="service-card">
									<div className="service-icon">📦</div>
									<h4>Shipping Services</h4>
									<p>Send packages at the lowest rates</p>
									<button
										className="service-button"
										onClick={() => {
											setSelectedService("📦 Shipping");
											setSelectedServiceId(1);
										}}
									>
										Get Ticket
									</button>
								</div>

								<div className="service-card">
									<div className="service-icon">💰</div>
									<h4>Financial Services</h4>
									<p>Deposits, withdrawals, payments</p>
									<button
										className="service-button"
										onClick={() => {
											setSelectedService("💰 Financial");
											setSelectedServiceId(3);
										}}
									>
										Get Ticket
									</button>
								</div>

								<div className="service-card">
									<div className="service-icon">📄</div>
									<h4>Document Services</h4>
									<p>Certificates, applications</p>
									<button
										className="service-button"
										onClick={() => {
											setSelectedService("📄 Document");
											setSelectedServiceId(2);
										}}
									>
										Get Ticket
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

interface TicketPageProps {
	service: string | null;
	selectedServiceId: number;
}

const TicketPage: React.FC<TicketPageProps> = ({
	service,
	selectedServiceId,
}) => {
	if (!service) return null;
	const [desk, setDesk] = useState<number | null>(null);
	const [ticket, setTicket] = useState<number | null>(null);
	const [estimatedWaitingTime, setEstimatedWaitingTime] = useState<number | null>(
		null
	);

	useEffect(() => {
		const getTicket = async () => {
			if (!ticket) {
				const ticketData = await newTicket(selectedServiceId);
				setTicket(ticketData.number);
				setEstimatedWaitingTime(ticketData.estimatedWaitingTime);
			}
		};
		getTicket();
	}, []);

	useEffect(() => {
		if (!ticket) return;

		const checkTicketStatus = async () => {
			try {
				// Check if this ticket has been called by an officer
				const response = await fetch(`http://localhost:3000/tickets/${ticket}`);
				if (response.ok) {
					const data = await response.json();
					if (data.success && data.data) {
						// Check if ticket is called and assigned to a desk
						const ticketData = data.data;
						
						// If ticket has desk_id, it means it was called by an officer
						if (ticketData.desk_id) {
							setDesk(ticketData.desk_id);
						}
					}
				}
			} catch (error) {
				console.error('Error checking ticket status:', error);
			}
		};

		// Poll every 2 seconds to check if ticket has been called
		const interval = setInterval(checkTicketStatus, 2000);
		
		// Cleanup interval on unmount
		return () => clearInterval(interval);
	}, [ticket]);

	const isAssigned = desk !== null;

	return (
		<section className="ticket-section" aria-labelledby="ticket-heading">
			<h2 id="ticket-heading" className="ticket-heading">🎟️ Your Ticket</h2>

			<div className="ticket-card" role="status" aria-live="polite">
				<div className="ticket-top">
					<div className="ticket-number-block">
						<span className="ticket-label">Ticket</span>
						<div className="ticket-number">
							{ticket == null ? "—" : ticket}
						</div>
					</div>

					<div className="ticket-status-block">
						<span className="ticket-label">Status </span>
						{ticket == null && (
							<span className="status-badge pending">Generating…</span>
						)}
						{ticket != null && !isAssigned && (
							<span className="status-badge waiting">Waiting for desk</span>
						)}
						{isAssigned && (
							<span className="status-badge assigned">Assigned</span>
						)}
					</div>
				</div>

				<div className="ticket-divider" aria-hidden="true" />

				<div className="ticket-details">
					<div className="ticket-detail">
						<span className="ticket-label">Service</span>
						<span className="ticket-value service-value">{service}</span>
					</div>

					{estimatedWaitingTime !== null && (
						<div className="ticket-detail">
							<span className="ticket-label">Estimated wait</span>
							<span className="ticket-value eta-value">⏱️ {estimatedWaitingTime} min</span>
						</div>
					)}

					{isAssigned && (
						<div className="ticket-desk-callout" role="alert" aria-live="assertive">
							<div className="desk-label">Proceed to desk</div>
							<div className="desk-number">{desk}</div>
						</div>
					)}
				</div>

				{ticket == null && (
					<p className="ticket-hint">Please hold on while we generate your ticket…</p>
				)}
				{ticket != null && !isAssigned && (
					<p className="ticket-hint">You’ll be notified here when a desk is available.</p>
				)}
			</div>
		</section>
	);
};

export default CustomerDashboard;
