package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.dto.GroupTripDto;
import com.travelcompanion.dto.GroupVoteDto;
import com.travelcompanion.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GroupPlannerController {

    private final GroupService groupService;

    @GetMapping("/trips/{tripId}/group")
    public ResponseEntity<ApiResponse<GroupTripDto>> getGroup(@PathVariable Long tripId) {
        GroupTripDto group = groupService.getGroupByTripId(tripId);
        return ResponseEntity.ok(ApiResponse.success(group));
    }

    @PostMapping("/trips/{tripId}/group")
    public ResponseEntity<ApiResponse<GroupTripDto>> createGroup(
            @PathVariable Long tripId,
            @RequestParam(required = false) String groupName) {
        GroupTripDto group = groupService.createOrGetGroup(tripId, groupName);
        return ResponseEntity.ok(ApiResponse.success(group, "Group created successfully"));
    }

    @PostMapping("/groups/{groupTripId}/vote")
    public ResponseEntity<ApiResponse<GroupTripDto>> submitVote(
            @PathVariable Long groupTripId,
            @RequestBody GroupVoteDto voteDto) {
        GroupTripDto group = groupService.submitVote(groupTripId, voteDto);
        return ResponseEntity.ok(ApiResponse.success(group, "Vote logged and itinerary compromise updated"));
    }
}
