package com.adorsys_gis.flight.service;

import com.adorsys_gis.flight.repository.FlightTicketRepository;
import com.adorsys_gis.flight.entity.FlightTicket;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FlightTicketService {

    private final FlightTicketRepository repository;


    public FlightTicketService(FlightTicketRepository repository) {
        this.repository = repository;
    }

    public void saveTicket(FlightTicket ticket) {
        repository.save(ticket);
    }

    public List<FlightTicket> searchByDate(LocalDate date) {
        return repository.findByBookingDate(date);
    }

    public List<FlightTicket> searchByDestination(String destination) {
        return repository.findByDestinationAddressIgnoreCase(destination);
    }

    public List<FlightTicket> searchByKickoff(String kickoff) {
        return repository.findByKickoffAddressIgnoreCase(kickoff);
    }

    public List<FlightTicket> getAllTickets() {
        return repository.findAll();
    }

    public List<FlightTicket> getTicketsForUser(String userId) {
        return repository.findByUserId(userId);
    }

    public FlightTicket updateTicket(Long id, FlightTicket updated) {
        return repository.findById(id).map(ticket -> {
            ticket.setPassengerName(updated.getPassengerName());
            ticket.setKickoffAddress(updated.getKickoffAddress());
            ticket.setDestinationAddress(updated.getDestinationAddress());
            if (updated.getBookingDate() != null) {
                ticket.setBookingDate(updated.getBookingDate());
            }
            return repository.save(ticket);
        }).orElse(null);
    }

    public FlightTicket updateTicketForUser(Long id, FlightTicket updated, String userId) {
        return repository.findById(id).filter(ticket -> userId.equals(ticket.getUserId())).map(ticket -> {
            ticket.setPassengerName(updated.getPassengerName());
            ticket.setKickoffAddress(updated.getKickoffAddress());
            ticket.setDestinationAddress(updated.getDestinationAddress());
            if (updated.getBookingDate() != null) {
                ticket.setBookingDate(updated.getBookingDate());
            }
            return repository.save(ticket);
        }).orElse(null);
    }

    public boolean deleteTicket(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean deleteTicketForUser(Long id, String userId) {
        return repository.findById(id).filter(ticket -> userId.equals(ticket.getUserId())).map(ticket -> {
            repository.deleteById(id);
            return true;
        }).orElse(false);
    }
}
