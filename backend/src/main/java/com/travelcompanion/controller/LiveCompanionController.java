package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.dto.CompanionAlertDto;
import com.travelcompanion.service.CompanionAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LiveCompanionController {

    private final CompanionAlertService companionAlertService;

    @GetMapping("/trips/{tripId}/companion/alerts")
    public ResponseEntity<ApiResponse<List<CompanionAlertDto>>> getTripAlerts(@PathVariable Long tripId) {
        List<CompanionAlertDto> alerts = companionAlertService.getTripAlerts(tripId);
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @PostMapping("/companion/alerts/{alertId}/accept")
    public ResponseEntity<ApiResponse<CompanionAlertDto>> acceptAlert(@PathVariable Long alertId) {
        CompanionAlertDto alert = companionAlertService.acceptAlert(alertId);
        return ResponseEntity.ok(ApiResponse.success(alert, "Alert accepted and itinerary updated"));
    }

    @PostMapping("/companion/alerts/{alertId}/reject")
    public ResponseEntity<ApiResponse<CompanionAlertDto>> rejectAlert(@PathVariable Long alertId) {
        CompanionAlertDto alert = companionAlertService.rejectAlert(alertId);
        return ResponseEntity.ok(ApiResponse.success(alert, "Alert dismissed"));
    }

    @GetMapping("/companion/alerts/{alertId}/why")
    public ResponseEntity<ApiResponse<Map<String, String>>> askWhy(@PathVariable Long alertId) {
        String reasoning = companionAlertService.askWhy(alertId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("reasoning", reasoning)));
    }
}
