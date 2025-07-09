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

}
