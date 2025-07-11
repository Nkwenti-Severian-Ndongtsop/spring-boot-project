import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FlightTicketControllerApi, FlightTicket } from '../api/apis/FlightTicketControllerApi';

const api = new FlightTicketControllerApi();

export function useTicketsApi() {
  const queryClient = useQueryClient();

  // Fetch all tickets
  const ticketsQuery = useQuery(['tickets'], () => api.getAllTickets());

  // Create ticket
  const createTicket = useMutation(
    (ticket: FlightTicket) => api.bookTicket({ flightTicket: ticket }),
    {
      onSuccess: () => queryClient.invalidateQueries(['tickets']),
    }
  );

  // Delete ticket (if supported by your API)
  const deleteTicket = useMutation<void, Error, number>(
    (ticketId) => api.deleteTicket({ id: ticketId }),
    {
      onSuccess: () => queryClient.invalidateQueries(['tickets']),
    }
  );

  // Update ticket
  const updateTicket = useMutation(
    (ticket: FlightTicket) => api.updateTicket({ id: ticket.id!, flightTicket: ticket }),
    {
      onSuccess: () => queryClient.invalidateQueries(['tickets']),
    }
  );

  return {
    ticketsQuery,
    createTicket,
    deleteTicket,
    updateTicket,
  };
} 