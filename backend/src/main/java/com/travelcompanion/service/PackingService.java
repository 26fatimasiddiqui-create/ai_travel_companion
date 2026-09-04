package com.travelcompanion.service;

import com.travelcompanion.dto.PackingItemDto;
import com.travelcompanion.entity.PackingItem;
import com.travelcompanion.entity.Trip;
import com.travelcompanion.repository.PackingItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PackingService {

    private final PackingItemRepository packingItemRepository;
    private final TripService tripService;
    private final AIService aiService;

    @Transactional
    public List<PackingItemDto> getPackingList(Long tripId) {
        List<PackingItem> items = packingItemRepository.findByTripIdOrderByCategoryAsc(tripId);
        if (items.isEmpty()) {
            return regeneratePackingList(tripId);
        }
        return items.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public List<PackingItemDto> regeneratePackingList(Long tripId) {
        Trip trip = tripService.getTripEntity(tripId);
        packingItemRepository.deleteByTripId(tripId);

        List<PackingItemDto> generated = aiService.generatePackingList(trip);
        List<PackingItem> entities = generated.stream().map(dto -> PackingItem.builder()
                .trip(trip)
                .category(dto.getCategory())
                .itemName(dto.getItemName())
                .isPacked(false)
                .weatherTrigger(dto.getWeatherTrigger())
                .build()).collect(Collectors.toList());

        return packingItemRepository.saveAll(entities).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public PackingItemDto toggleItem(Long itemId) {
        PackingItem item = packingItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Packing item not found: " + itemId));
        item.setIsPacked(!Boolean.TRUE.equals(item.getIsPacked()));
        return toDto(packingItemRepository.save(item));
    }

    @Transactional
    public PackingItemDto addItem(Long tripId, PackingItemDto dto) {
        Trip trip = tripService.getTripEntity(tripId);
        PackingItem item = PackingItem.builder()
                .trip(trip)
                .category(dto.getCategory() != null ? dto.getCategory().toUpperCase() : "GEAR")
                .itemName(dto.getItemName())
                .isPacked(false)
                .weatherTrigger(dto.getWeatherTrigger())
                .build();
        return toDto(packingItemRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long itemId) {
        packingItemRepository.deleteById(itemId);
    }

    private PackingItemDto toDto(PackingItem item) {
        return PackingItemDto.builder()
                .id(item.getId())
                .tripId(item.getTrip().getId())
                .category(item.getCategory())
                .itemName(item.getItemName())
                .isPacked(item.getIsPacked())
                .weatherTrigger(item.getWeatherTrigger())
                .build();
    }
}
