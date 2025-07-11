import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FlightTicketControllerApi } from '../api/apis/FlightTicketControllerApi';
import { FlightTicket } from '../api/models/FlightTicket';

const api = new FlightTicketControllerApi();

export function useTicketsApi() {
  const queryClient = useQueryClient();

  // Fetch all tickets
  const ticketsQuery = useQuery({
    queryKey: ['tickets'],
    queryFn: () => api.getTickets(),
  });

  // Create ticket
  const createTicket = useMutation({
    mutationFn: (ticket: FlightTicket) => api.bookTicket({ flightTicket: ticket }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });

  // Delete ticket (if supported by your API)
  const deleteTicket = useMutation({
    mutationFn: (ticketId: number) => api.deleteTicket({ id: ticketId }).then(() => undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });

  // Update ticket
  const updateTicket = useMutation({
    mutationFn: (ticket: FlightTicket) => api.updateTicket({ id: ticket.id!, flightTicket: ticket }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });

  return {
    ticketsQuery,
    createTicket,
    deleteTicket,
    updateTicket,
  };
} 