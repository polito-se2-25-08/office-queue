const URI = "http://localhost:3000";

interface DataDTO<T> {
	message: string;
	success: boolean;
	data: T;
}
interface Ticket {
	number: number;
	service_id: number;
	serviceName: string;
	collectedAt: string;
	estimatedWaitingTime: number;
}

export async function CheckServer() {
	const response = await fetch(URI + "/health");
	if (response.ok) {
		console.log("Server is healthy");
		const data = await response.json();
		return data.status === "ok";
	} else {
		throw new Error("Server is not reachable");
	}
}
export async function newTicket(serviceId: number): Promise<Ticket> {
	const response = await fetch(URI + "/tickets", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ serviceId }),
	});
	if (response.ok) {
		const data: DataDTO<Ticket> = await response.json();
		console.log("Ticket created: ", data.data);
		return data.data;
	} else {
		console.log(response.json());
		throw new Error("Server is not reachable");
	}
}

export async function callTicket(desk_id: number) {
	const response = await fetch(URI + `/tickets/call/${desk_id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		console.log("Ticket called: ", data);
		return data;
	} else {
		throw new Error("Server is not reachable");
	}
}

export async function checkTicket(ticketId: number) {
	//backend checks if ticket is in tickets table (not served) or in served (called)
	//response containing a desk_id if present
	const response = await fetch(URI + `/tickets/${ticketId}/status`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		console.log("Ticket status: ", data);
		return data;
	} else {
		throw new Error("Server is not reachable");
	}
}
