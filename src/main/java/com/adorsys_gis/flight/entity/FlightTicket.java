package com.adorsys_gis.flight.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Data
public class FlightTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Passenger name is required.")
    @Size(min = 3, message = "Passenger name must be at least 3 characters.")
    private String passengerName;

    @NotBlank(message = "Kickoff address is required.")
    @Size(min = 2, message = "Kickoff address must be at least 2 characters.")
    private String kickoffAddress;

    @NotBlank(message = "Destination address is required.")
    @Size(min = 2, message = "Destination address must be at least 2 characters.")
    private String destinationAddress;

    @Getter
    @Setter
    private LocalDate bookingDate;

}
