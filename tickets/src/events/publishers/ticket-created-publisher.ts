import { Publisher, Subjects, TicketCreatedEvent } from '@ticketty/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
