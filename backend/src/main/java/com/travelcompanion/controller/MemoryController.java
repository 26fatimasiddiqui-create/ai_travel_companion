package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.dto.MemoryDto;
import com.travelcompanion.service.MemoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemoryController {

    private final MemoryService memoryService;

    @GetMapping("/trips/{tripId}/memories")
    public ResponseEntity<ApiResponse<List<MemoryDto>>> getTripMemories(@PathVariable Long tripId) {
        List<MemoryDto> memories = memoryService.getTripMemories(tripId);
        return ResponseEntity.ok(ApiResponse.success(memories));
    }

    @PostMapping("/trips/{tripId}/memories")
    public ResponseEntity<ApiResponse<MemoryDto>> createMemory(
            @PathVariable Long tripId,
            @RequestBody MemoryDto dto) {
        MemoryDto memory = memoryService.createMemory(tripId, dto);
        return ResponseEntity.ok(ApiResponse.success(memory, "Memory logged to travel journal"));
    }

    @DeleteMapping("/memories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMemory(@PathVariable Long id) {
        memoryService.deleteMemory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Memory deleted"));
    }
}
