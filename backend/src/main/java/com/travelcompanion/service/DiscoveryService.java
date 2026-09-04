package com.travelcompanion.service;

import com.travelcompanion.entity.Place;
import com.travelcompanion.repository.PlaceRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscoveryService {

    private final PlaceRepository placeRepository;

    @Data
    @Builder
    public static class CrowdForecastDto {
        private String placeName;
        private String currentStatus; // QUIET, MODERATE, CROWDED
        private String bestTimeToVisit;
        private String peakHours;
        private String quietHours;
        private Integer estimatedWaitMinutes;
        private boolean isSimulated;
    }

    public List<Place> getHiddenGems(String destination, String mood) {
        List<Place> gems = placeRepository.findByIsHiddenGemTrue();
        if (destination != null && !destination.isBlank()) {
            gems = gems.stream()
                    .filter(p -> p.getDestination().toLowerCase().contains(destination.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (mood != null && !mood.isBlank()) {
            String m = mood.toUpperCase();
            List<Place> filtered = gems.stream()
                    .filter(p -> p.getSuitedMood() != null && p.getSuitedMood().toUpperCase().contains(m))
                    .collect(Collectors.toList());
            if (!filtered.isEmpty()) {
                return filtered;
            }
        }
        return gems;
    }

    public List<CrowdForecastDto> getCrowdForecasts(String destination) {
        List<Place> places = placeRepository.findByDestinationIgnoreCase(destination != null ? destination : "Jaipur");
        return places.stream().map(p -> {
            String quiet = p.getCrowdQuietHours() != null ? p.getCrowdQuietHours() : "08:30 AM - 10:30 AM";
            String peak = p.getCrowdPeakHours() != null ? p.getCrowdPeakHours() : "02:00 PM - 05:00 PM";
            String current = p.getIsHiddenGem() ? "QUIET" : "MODERATE";
            int wait = p.getIsHiddenGem() ? 5 : 25;

            return CrowdForecastDto.builder()
                    .placeName(p.getName())
                    .currentStatus(current)
                    .bestTimeToVisit(quiet)
                    .quietHours(quiet)
                    .peakHours(peak)
                    .estimatedWaitMinutes(wait)
                    .isSimulated(true) // Explicitly denote crowd estimation per prompt specification
                    .build();
        }).collect(Collectors.toList());
    }

    public List<Place> getAllPlaces(String destination) {
        if (destination != null && !destination.isBlank()) {
            return placeRepository.findByDestinationIgnoreCase(destination);
        }
        return placeRepository.findAll();
    }
}
