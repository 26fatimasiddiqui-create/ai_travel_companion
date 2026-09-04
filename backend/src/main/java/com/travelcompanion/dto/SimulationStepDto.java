package com.travelcompanion.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulationStepDto {
    private Integer stepNumber;
    private String time;
    private String activityTitle;
    private String placeName;
    private String stepType; // DEPARTURE, ATTRACTION, WALK, TRANSIT, MEAL, RETURN
    private Integer durationMinutes;
    private Integer travelTimeMinutes;
    private Double cost;
    private String instruction;
    private String crowdLevel;
    private String weatherNote;
    private String accessibilityNote;
    private Double latitude;
    private Double longitude;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimulationDayDto {
        private Integer dayNumber;
        private String date;
        private String summary;
        private Double totalEstimatedCost;
        private Integer totalDurationMinutes;
        private List<SimulationStepDto> steps;
    }
}
