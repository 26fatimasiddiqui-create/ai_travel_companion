package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.dto.SimulationStepDto;
import com.travelcompanion.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;

    @GetMapping("/{tripId}/simulation")
    public ResponseEntity<ApiResponse<List<SimulationStepDto.SimulationDayDto>>> getTripSimulation(@PathVariable Long tripId) {
        List<SimulationStepDto.SimulationDayDto> simulation = simulationService.simulateTrip(tripId);
        return ResponseEntity.ok(ApiResponse.success(simulation, "Trip simulated minute-by-minute"));
    }
}
