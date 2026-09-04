package com.travelcompanion.service;

import com.travelcompanion.dto.ItineraryItemDto;
import com.travelcompanion.entity.CompanionAlert;
import com.travelcompanion.entity.ItineraryItem;
import com.travelcompanion.entity.Trip;
import com.travelcompanion.repository.CompanionAlertRepository;
import com.travelcompanion.repository.ItineraryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryItemRepository itineraryItemRepository;
    private final CompanionAlertRepository companionAlertRepository;
    private final TripService tripService;
    private final AIService aiService;

    @Transactional
    public List<ItineraryItemDto> generateAndSaveItinerary(Long tripId) {
        Trip trip = tripService.getTripEntity(tripId);

        // Remove old items
        itineraryItemRepository.deleteByTripId(tripId);

        // Generate items via AI Service
        List<ItineraryItemDto> generated = aiService.generateItinerary(trip);

        List<ItineraryItem> entities = generated.stream().map(dto -> ItineraryItem.builder()
                .trip(trip)
                .dayNumber(dto.getDayNumber())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .placeName(dto.getPlaceName())
                .category(dto.getCategory())
                .durationMinutes(dto.getDurationMinutes())
                .travelTimeMinutes(dto.getTravelTimeMinutes())
                .estimatedCost(dto.getEstimatedCost())
                .recommendationReason(dto.getRecommendationReason())
                .weatherConsideration(dto.getWeatherConsideration())
                .crowdLevel(dto.getCrowdLevel())
                .accessibilityNote(dto.getAccessibilityNote())
                .safetyNote(dto.getSafetyNote())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .isCompleted(false)
                .build()
        ).collect(Collectors.toList());

        List<ItineraryItem> saved = itineraryItemRepository.saveAll(entities);

        // Generate situational live companion alerts
        List<CompanionAlert> alerts = aiService.generateLiveCompanionAlerts(trip, generated);
        companionAlertRepository.saveAll(alerts);

        return saved.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ItineraryItemDto> getTripItinerary(Long tripId) {
        List<ItineraryItem> items = itineraryItemRepository.findByTripIdOrderByDayNumberAscStartTimeAsc(tripId);
        if (items.isEmpty()) {
            return generateAndSaveItinerary(tripId);
        }
        return items.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ItineraryItemDto toggleCompleted(Long itemId) {
        ItineraryItem item = itineraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Itinerary item not found: " + itemId));
        item.setIsCompleted(!Boolean.TRUE.equals(item.getIsCompleted()));
        return toDto(itineraryItemRepository.save(item));
    }

    @Transactional
    public ItineraryItemDto updateItem(Long itemId, ItineraryItemDto dto) {
        ItineraryItem item = itineraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Itinerary item not found: " + itemId));
        if (dto.getPlaceName() != null) item.setPlaceName(dto.getPlaceName());
        if (dto.getStartTime() != null) item.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) item.setEndTime(dto.getEndTime());
        if (dto.getCategory() != null) item.setCategory(dto.getCategory());
        if (dto.getEstimatedCost() != null) item.setEstimatedCost(dto.getEstimatedCost());
        if (dto.getRecommendationReason() != null) item.setRecommendationReason(dto.getRecommendationReason());
        return toDto(itineraryItemRepository.save(item));
    }

    public ItineraryItemDto toDto(ItineraryItem item) {
        return ItineraryItemDto.builder()
                .id(item.getId())
                .tripId(item.getTrip().getId())
                .dayNumber(item.getDayNumber())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .placeName(item.getPlaceName())
                .category(item.getCategory())
                .durationMinutes(item.getDurationMinutes())
                .travelTimeMinutes(item.getTravelTimeMinutes())
                .estimatedCost(item.getEstimatedCost())
                .recommendationReason(item.getRecommendationReason())
                .weatherConsideration(item.getWeatherConsideration())
                .crowdLevel(item.getCrowdLevel())
                .accessibilityNote(item.getAccessibilityNote())
                .safetyNote(item.getSafetyNote())
                .isCompleted(item.getIsCompleted())
                .latitude(item.getLatitude())
                .longitude(item.getLongitude())
                .build();
    }
}
