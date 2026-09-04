package com.travelcompanion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripRequest {

    private String title;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Budget is required")
    private Double budget;

    private Integer travelersCount;

    // SOLO, COUPLE, FAMILY, GROUP
    private String travelType;

    // RELAXED, ROMANTIC, ADVENTURE, FAMILY, SOLO, PHOTOGRAPHY, FOOD_LOVER
    private String mood;

    // NONE, WHEELCHAIR, SENIOR, YOUNG_FAMILY
    private String accessibilityProfile;

    private String interests;

    private String accommodationPreference;
}
