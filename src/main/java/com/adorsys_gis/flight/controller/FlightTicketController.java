package com.adorsys_gis.flight.controller;

import com.adorsys_gis.flight.entity.FlightTicket;
import com.adorsys_gis.flight.service.FlightTicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/tickets")
public class FlightTicketController {

    private final FlightTicketService service;

    public FlightTicketController(FlightTicketService service) {
        this.service = service;
    }

    @GetMapping
    public List<FlightTicket> getTickets(@AuthenticationPrincipal Jwt jwt) {
        return service.getTicketsForUser(jwt.getSubject());
    }

    @PostMapping
    public ResponseEntity<?> bookTicket(@Valid @RequestBody FlightTicket ticket, BindingResult result, @AuthenticationPrincipal Jwt jwt) {
        if (result.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            result.getFieldErrors().forEach(e -> errors.append(e.getDefaultMessage()).append("; "));
            return ResponseEntity.badRequest().body(Map.of("error", errors.toString()));
        }
        
        ticket.setBookingDate(LocalDate.now());
        ticket.setUserId(jwt.getSubject());
        service.saveTicket(ticket);
        return ResponseEntity.status(201).body(Map.of("message", "Ticket created successfully."));
    }

    @GetMapping("/date/{date}")
    public List<FlightTicket> byDate(@PathVariable String date) {
        return service.searchByDate(LocalDate.parse(date));
    }


    @GetMapping("/destination/{dest}")
    public List<FlightTicket> byDestination(@PathVariable String dest) {
        return service.searchByDestination(dest);
    }

    @GetMapping("/kickoff/{kickoff}")
    public List<FlightTicket> byKickoff(@PathVariable String kickoff) {
        return service.searchByKickoff(kickoff);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, @Valid @RequestBody FlightTicket ticket, BindingResult result, @AuthenticationPrincipal Jwt jwt) {
        if (result.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            result.getFieldErrors().forEach(e -> errors.append(e.getDefaultMessage()).append("; "));
            return ResponseEntity.badRequest().body(Map.of("error", errors.toString()));
        }
        
        FlightTicket updated = service.updateTicketForUser(id, ticket, jwt.getSubject());
        if (updated == null) {
            return ResponseEntity.status(403).body(Map.of("error", "Not authorized or ticket not found."));
        }
        return ResponseEntity.ok(Map.of("message", "Ticket updated successfully."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        boolean deleted = service.deleteTicketForUser(id, jwt.getSubject());
        if (!deleted) {
            return ResponseEntity.status(403).body(Map.of("error", "Not authorized or ticket not found."));
        }
        return ResponseEntity.ok(Map.of("message", "Ticket deleted successfully."));
    }

    @GetMapping("/health")
    public String health() {
        return "@Nkwenti flight api running\n";
    }
}