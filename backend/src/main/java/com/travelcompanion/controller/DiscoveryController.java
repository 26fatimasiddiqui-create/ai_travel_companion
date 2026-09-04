package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.entity.Place;
import com.travelcompanion.service.DiscoveryService;
import com.travelcompanion.service.LocationService;
import com.travelcompanion.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DiscoveryController {

    private final DiscoveryService discoveryService;
    private final LocationService locationService;
    private final WeatherService weatherService;

    @GetMapping("/places/hidden-gems")
    public ResponseEntity<ApiResponse<List<Place>>> getHiddenGems(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String mood) {
        List<Place> gems = discoveryService.getHiddenGems(destination, mood);
        return ResponseEntity.ok(ApiResponse.success(gems));
    }

    @GetMapping("/places/crowds")
    public ResponseEntity<ApiResponse<List<DiscoveryService.CrowdForecastDto>>> getCrowdForecasts(
            @RequestParam(required = false, defaultValue = "Jaipur") String destination) {
        List<DiscoveryService.CrowdForecastDto> forecasts = discoveryService.getCrowdForecasts(destination);
        return ResponseEntity.ok(ApiResponse.success(forecasts));
    }

    @GetMapping("/places/safety")
    public ResponseEntity<ApiResponse<LocationService.SafetyReport>> getSafetyReport(
            @RequestParam(required = false, defaultValue = "Jaipur") String destination,
            @RequestParam(required = false, defaultValue = "SOLO") String profile) {
        LocationService.SafetyReport report = locationService.getSafetyReport(destination, profile);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/places")
    public ResponseEntity<ApiResponse<List<Place>>> getPlaces(
            @RequestParam(required = false) String destination) {
        List<Place> places = discoveryService.getAllPlaces(destination);
        return ResponseEntity.ok(ApiResponse.success(places));
    }

    @GetMapping("/weather")
    public ResponseEntity<ApiResponse<WeatherService.WeatherInfo>> getWeather(
            @RequestParam(required = false, defaultValue = "Jaipur") String destination,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        WeatherService.WeatherInfo info = weatherService.getWeather(destination, lat, lon);
        return ResponseEntity.ok(ApiResponse.success(info));
    }
}
