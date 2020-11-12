import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketty/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
