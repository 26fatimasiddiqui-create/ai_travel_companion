package com.travelcompanion.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupTripDto {
    private Long id;
    private Long tripId;
    private String groupName;
    private String inviteCode;
    private List<String> members;
    private String compromiseSummary;
    private List<GroupVoteDto> votes;
    private Double totalSplitPerPerson;
}
