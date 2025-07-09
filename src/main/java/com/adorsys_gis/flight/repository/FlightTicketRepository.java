package com.adorsys_gis.flight.repository;

import com.adorsys_gis.flight.entity.FlightTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface FlightTicketRepository extends JpaRepository<FlightTicket, Long> {

    List<FlightTicket> findByBookingDate(LocalDate bookingDate);
    List<FlightTicket> findByDestinationAddressIgnoreCase(String destinationAddress);
    List<FlightTicket> findByKickoffAddressIgnoreCase(String kickoffAddress);
}
