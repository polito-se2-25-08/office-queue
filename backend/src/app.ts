import express, { Application } from "express";
import cors from "cors";
import ticketRoutes from "../src/routes/ticket.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { TicketRepository } from "./repositories/TicketRepository.js";
import { ServiceRepository } from "./repositories/ServiceRepository.js";
import { QueueRepository } from "./repositories/QueueRepository.js";
import { TicketService } from "./services/TicketService.js";
import { TicketController } from "./controllers/ticketController.js";

const app: Application = express();
//////////
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG: Log everything about the request
app.use((req, res, next) => {
	console.log("=== INCOMING REQUEST ===");
	console.log(`Method: ${req.method}`);
	console.log(`Path: ${req.path}`);
	console.log(`Content-Type: ${req.get("Content-Type")}`);
	console.log(`Body:`, req.body);
	console.log(`Raw body type:`, typeof req.body);
	console.log("========================");
	next();
}); /////////////////
// Routes
const ticketRepo = new TicketRepository();
const serviceRepo = new ServiceRepository(); //PLACEHOLDER
const queueRepo = new QueueRepository(); // PLACEHOLDER

// Initialize service
const ticketService = new TicketService(ticketRepo, serviceRepo, queueRepo);

// Initialize controller
const ticketController = new TicketController(ticketService);

// Routes for "Get Ticket" story
app.get("/services", ticketController.getAvailableServices);
app.post("/tickets", ticketController.createTicket);
app.get("/tickets/:ticket_id", ticketController.getTicket);
app.get("/tickets/:ticket_id/call/:desk_id", ticketController.callTicket);
app.get("/tickets/:ticket_id/serve", ticketController.serveTicket);

// Health check
app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

// Error handling (must be last)
app.use(errorHandler);

export default app;
