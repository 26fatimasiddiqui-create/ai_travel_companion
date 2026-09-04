package com.travelcompanion.service;

import com.travelcompanion.dto.TripRequest;
import com.travelcompanion.dto.TripResponse;
import com.travelcompanion.entity.Trip;
import com.travelcompanion.entity.User;
import com.travelcompanion.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final AuthService authService;

    @Transactional
    public TripResponse createTrip(TripRequest request, String userEmail) {
        User user = authService.getUserByEmail(userEmail);

        String title = request.getTitle();
        if (title == null || title.isBlank()) {
            title = "Trip to " + request.getDestination();
        }

        Trip trip = Trip.builder()
                .user(user)
                .title(title)
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .travelersCount(request.getTravelersCount() != null ? request.getTravelersCount() : 1)
                .travelType(request.getTravelType() != null ? request.getTravelType() : "SOLO")
                .mood(request.getMood() != null ? request.getMood() : "RELAXED")
                .accessibilityProfile(request.getAccessibilityProfile() != null ? request.getAccessibilityProfile() : "NONE")
                .interests(request.getInterests())
                .accommodationPreference(request.getAccommodationPreference())
                .build();

        trip = tripRepository.save(trip);
        return toTripResponse(trip);
    }

    public List<TripResponse> getUserTrips(String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        return tripRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toTripResponse)
                .collect(Collectors.toList());
    }

    public Trip getTripEntity(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with ID: " + tripId));
    }

    public TripResponse getTripById(Long tripId) {
        return toTripResponse(getTripEntity(tripId));
    }

    @Transactional
    public TripResponse updateTrip(Long tripId, TripRequest request) {
        Trip trip = getTripEntity(tripId);
        if (request.getTitle() != null) trip.setTitle(request.getTitle());
        if (request.getDestination() != null) trip.setDestination(request.getDestination());
        if (request.getStartDate() != null) trip.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) trip.setEndDate(request.getEndDate());
        if (request.getBudget() != null) trip.setBudget(request.getBudget());
        if (request.getTravelersCount() != null) trip.setTravelersCount(request.getTravelersCount());
        if (request.getMood() != null) trip.setMood(request.getMood());
        if (request.getAccessibilityProfile() != null) trip.setAccessibilityProfile(request.getAccessibilityProfile());
        if (request.getInterests() != null) trip.setInterests(request.getInterests());
        return toTripResponse(tripRepository.save(trip));
    }

    @Transactional
    public void deleteTrip(Long tripId) {
        tripRepository.deleteById(tripId);
    }

    public TripResponse toTripResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .budget(trip.getBudget())
                .travelersCount(trip.getTravelersCount())
                .travelType(trip.getTravelType())
                .mood(trip.getMood())
                .accessibilityProfile(trip.getAccessibilityProfile())
                .interests(trip.getInterests())
                .accommodationPreference(trip.getAccommodationPreference())
                .createdAt(trip.getCreatedAt())
                .build();
    }
}
