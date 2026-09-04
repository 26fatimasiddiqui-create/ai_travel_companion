package com.travelcompanion.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelcompanion.dto.GroupTripDto;
import com.travelcompanion.dto.GroupVoteDto;
import com.travelcompanion.entity.GroupTrip;
import com.travelcompanion.entity.GroupVote;
import com.travelcompanion.entity.Trip;
import com.travelcompanion.repository.GroupTripRepository;
import com.travelcompanion.repository.GroupVoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupTripRepository groupTripRepository;
    private final GroupVoteRepository groupVoteRepository;
    private final TripService tripService;
    private final AIService aiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public GroupTripDto createOrGetGroup(Long tripId, String groupName) {
        Optional<GroupTrip> existing = groupTripRepository.findByTripId(tripId);
        if (existing.isPresent()) {
            return toDto(existing.get());
        }

        Trip trip = tripService.getTripEntity(tripId);
        String inviteCode = "GRP-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        List<String> defaultMembers = List.of(trip.getUser().getFullName(), "Alex Morgan", "Samira Khan");

        String membersJson = "[]";
        try {
            membersJson = objectMapper.writeValueAsString(defaultMembers);
        } catch (Exception ignored) {}

        GroupTrip groupTrip = GroupTrip.builder()
                .trip(trip)
                .groupName(groupName != null ? groupName : trip.getTitle() + " Explorers")
                .inviteCode(inviteCode)
                .membersJson(membersJson)
                .compromiseSummary("All group members are invited to select favorite spots. AI will reconcile votes into an optimal shared itinerary.")
                .build();

        groupTrip = groupTripRepository.save(groupTrip);

        // Add sample votes for demonstration
        GroupVote v1 = GroupVote.builder()
                .groupTrip(groupTrip)
                .voterName(trip.getUser().getFullName())
                .preferredPlaces("Amber Fort, Nahargarh Sunset")
                .preferredActivities("Heritage walking, Photography")
                .budgetCap(4500.0)
                .build();

        GroupVote v2 = GroupVote.builder()
                .groupTrip(groupTrip)
                .voterName("Alex Morgan")
                .preferredPlaces("Johari Bazaar, Hidden Stepwell")
                .preferredActivities("Street Food tasting, Local shopping")
                .budgetCap(4000.0)
                .build();

        groupVoteRepository.saveAll(List.of(v1, v2));

        return toDto(groupTrip);
    }

    public GroupTripDto getGroupByTripId(Long tripId) {
        return groupTripRepository.findByTripId(tripId)
                .map(this::toDto)
                .orElseGet(() -> createOrGetGroup(tripId, null));
    }

    @Transactional
    public GroupTripDto submitVote(Long groupTripId, GroupVoteDto voteDto) {
        GroupTrip groupTrip = groupTripRepository.findById(groupTripId)
                .orElseThrow(() -> new RuntimeException("Group not found: " + groupTripId));

        GroupVote vote = GroupVote.builder()
                .groupTrip(groupTrip)
                .voterName(voteDto.getVoterName())
                .preferredPlaces(voteDto.getPreferredPlaces())
                .preferredActivities(voteDto.getPreferredActivities())
                .budgetCap(voteDto.getBudgetCap())
                .build();

        groupVoteRepository.save(vote);

        // Add voter name to members list if not already present
        List<String> members = parseMembers(groupTrip.getMembersJson());
        if (!members.contains(voteDto.getVoterName())) {
            members.add(voteDto.getVoterName());
            try {
                groupTrip.setMembersJson(objectMapper.writeValueAsString(members));
            } catch (Exception ignored) {}
        }

        // Re-generate compromise
        String summary = aiService.generateGroupCompromiseSummary(members, List.of(voteDto.getPreferredPlaces()), List.of(voteDto.getPreferredActivities()));
        groupTrip.setCompromiseSummary(summary);
        groupTripRepository.save(groupTrip);

        return toDto(groupTrip);
    }

    private List<String> parseMembers(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>(Arrays.asList(json.replace("[", "").replace("]", "").replace("\"", "").split(",")));
        }
    }

    private GroupTripDto toDto(GroupTrip groupTrip) {
        List<GroupVote> votes = groupVoteRepository.findByGroupTripId(groupTrip.getId());
        List<GroupVoteDto> voteDtos = votes.stream().map(v -> GroupVoteDto.builder()
                .id(v.getId())
                .groupTripId(groupTrip.getId())
                .voterName(v.getVoterName())
                .preferredPlaces(v.getPreferredPlaces())
                .preferredActivities(v.getPreferredActivities())
                .budgetCap(v.getBudgetCap())
                .build()).collect(Collectors.toList());

        List<String> members = parseMembers(groupTrip.getMembersJson());
        double totalBudget = groupTrip.getTrip().getBudget() != null ? groupTrip.getTrip().getBudget() : 5000.0;
        int count = Math.max(1, members.size());

        return GroupTripDto.builder()
                .id(groupTrip.getId())
                .tripId(groupTrip.getTrip().getId())
                .groupName(groupTrip.getGroupName())
                .inviteCode(groupTrip.getInviteCode())
                .members(members)
                .compromiseSummary(groupTrip.getCompromiseSummary())
                .votes(voteDtos)
                .totalSplitPerPerson(totalBudget / count)
                .build();
    }
}
