package com.travelcompanion.service;

import com.travelcompanion.dto.ItineraryItemDto;
import com.travelcompanion.dto.SimulationStepDto;
import com.travelcompanion.entity.Trip;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulationService {

    private final TripService tripService;
    private final ItineraryService itineraryService;
    private final AIService aiService;

    public List<SimulationStepDto.SimulationDayDto> simulateTrip(Long tripId) {
        Trip trip = tripService.getTripEntity(tripId);
        List<ItineraryItemDto> items = itineraryService.getTripItinerary(tripId);
        return aiService.simulateTrip(trip, items);
    }
}
