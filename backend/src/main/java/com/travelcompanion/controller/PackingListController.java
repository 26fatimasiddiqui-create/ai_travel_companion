package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.dto.PackingItemDto;
import com.travelcompanion.service.PackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PackingListController {

    private final PackingService packingService;

    @GetMapping("/trips/{tripId}/packing-list")
    public ResponseEntity<ApiResponse<List<PackingItemDto>>> getPackingList(@PathVariable Long tripId) {
        List<PackingItemDto> list = packingService.getPackingList(tripId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PatchMapping("/packing-list/{itemId}/toggle")
    public ResponseEntity<ApiResponse<PackingItemDto>> toggleItem(@PathVariable Long itemId) {
        PackingItemDto item = packingService.toggleItem(itemId);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @PostMapping("/trips/{tripId}/packing-list")
    public ResponseEntity<ApiResponse<PackingItemDto>> addItem(
            @PathVariable Long tripId,
            @RequestBody PackingItemDto dto) {
        PackingItemDto item = packingService.addItem(tripId, dto);
        return ResponseEntity.ok(ApiResponse.success(item, "Item added to checklist"));
    }

    @DeleteMapping("/packing-list/{itemId}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long itemId) {
        packingService.deleteItem(itemId);
        return ResponseEntity.ok(ApiResponse.success(null, "Item removed"));
    }

    @PostMapping("/trips/{tripId}/packing-list/regenerate")
    public ResponseEntity<ApiResponse<List<PackingItemDto>>> regenerateList(@PathVariable Long tripId) {
        List<PackingItemDto> list = packingService.regeneratePackingList(tripId);
        return ResponseEntity.ok(ApiResponse.success(list, "Packing list refreshed based on forecast"));
    }
}
