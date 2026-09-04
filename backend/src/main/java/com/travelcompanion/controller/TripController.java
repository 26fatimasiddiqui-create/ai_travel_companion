package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.dto.ItineraryItemDto;
import com.travelcompanion.dto.TripRequest;
import com.travelcompanion.dto.TripResponse;
import com.travelcompanion.service.ItineraryService;
import com.travelcompanion.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final ItineraryService itineraryService;

    @PostMapping
    public ResponseEntity<ApiResponse<TripResponse>> createTrip(
            @Valid @RequestBody TripRequest request,
            Authentication authentication) {
        TripResponse response = tripService.createTrip(request, authentication.getName());
        // Auto-generate initial itinerary for the new trip
        itineraryService.generateAndSaveItinerary(response.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Trip created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripResponse>>> getUserTrips(Authentication authentication) {
        List<TripResponse> trips = tripService.getUserTrips(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(trips));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(@PathVariable Long id) {
        TripResponse trip = tripService.getTripById(id);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponse>> updateTrip(
            @PathVariable Long id,
            @RequestBody TripRequest request) {
        TripResponse trip = tripService.updateTrip(id, request);
        return ResponseEntity.ok(ApiResponse.success(trip, "Trip updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Trip deleted successfully"));
    }

    @PostMapping("/{id}/generate-itinerary")
    public ResponseEntity<ApiResponse<List<ItineraryItemDto>>> generateItinerary(@PathVariable Long id) {
        List<ItineraryItemDto> items = itineraryService.generateAndSaveItinerary(id);
        return ResponseEntity.ok(ApiResponse.success(items, "Itinerary generated successfully"));
    }

    @GetMapping("/{id}/itinerary")
    public ResponseEntity<ApiResponse<List<ItineraryItemDto>>> getItinerary(@PathVariable Long id) {
        List<ItineraryItemDto> items = itineraryService.getTripItinerary(id);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PatchMapping("/itinerary/{itemId}/toggle")
    public ResponseEntity<ApiResponse<ItineraryItemDto>> toggleItineraryItem(@PathVariable Long itemId) {
        ItineraryItemDto item = itineraryService.toggleCompleted(itemId);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @PutMapping("/itinerary/{itemId}")
    public ResponseEntity<ApiResponse<ItineraryItemDto>> updateItineraryItem(
            @PathVariable Long itemId,
            @RequestBody ItineraryItemDto dto) {
        ItineraryItemDto item = itineraryService.updateItem(itemId, dto);
        return ResponseEntity.ok(ApiResponse.success(item, "Itinerary item updated"));
    }
}
