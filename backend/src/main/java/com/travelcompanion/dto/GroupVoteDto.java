package com.travelcompanion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupVoteDto {
    private Long id;
    private Long groupTripId;
    private String voterName;
    private String preferredPlaces;
    private String preferredActivities;
    private Double budgetCap;
}
