import { Request, Response, NextFunction } from 'express';

export const newTicket = (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({ message: 'New Ticket Created'});
};