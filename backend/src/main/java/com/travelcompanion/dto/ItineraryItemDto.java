package com.travelcompanion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryItemDto {
    private Long id;
    private Long tripId;
    private Integer dayNumber;
    private String startTime;
    private String endTime;
    private String placeName;
    private String category;
    private Integer durationMinutes;
    private Integer travelTimeMinutes;
    private Double estimatedCost;
    private String recommendationReason;
    private String weatherConsideration;
    private String crowdLevel;
    private String accessibilityNote;
    private String safetyNote;
    private Boolean isCompleted;
    private Double latitude;
    private Double longitude;
}
