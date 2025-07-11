package com.adorsys_gis.flight.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Data
@Schema(description = "A flight ticket entity")
public class FlightTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier for the ticket", example = "1")
    private Long id;

    @NotBlank(message = "Passenger name is required.")
    @Size(min = 3, message = "Passenger name must be at least 3 characters.")
    @Schema(description = "Name of the passenger", example = "John Doe")
    private String passengerName;

    @NotBlank(message = "Kickoff address is required.")
    @Size(min = 2, message = "Kickoff address must be at least 2 characters.")
    @Schema(description = "Departure location", example = "Berlin")
    private String kickoffAddress;

    @NotBlank(message = "Destination address is required.")
    @Size(min = 2, message = "Destination address must be at least 2 characters.")
    @Schema(description = "Destination location", example = "Paris")
    private String destinationAddress;

    @Getter
    @Setter
    @Schema(description = "Date of booking", example = "2024-06-20")
    private LocalDate bookingDate;

    @Column(updatable = false)
    @Schema(description = "Timestamp when the ticket was created", example = "2024-06-20T12:34:56")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
