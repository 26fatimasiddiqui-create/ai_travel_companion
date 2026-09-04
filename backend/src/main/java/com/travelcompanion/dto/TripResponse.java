package com.travelcompanion.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponse {
    private Long id;
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double budget;
    private Integer travelersCount;
    private String travelType;
    private String mood;
    private String accessibilityProfile;
    private String interests;
    private String accommodationPreference;
    private LocalDateTime createdAt;
}
