package com.travelcompanion.service;

import com.travelcompanion.dto.MemoryDto;
import com.travelcompanion.entity.Memory;
import com.travelcompanion.entity.Trip;
import com.travelcompanion.repository.MemoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemoryService {

    private final MemoryRepository memoryRepository;
    private final TripService tripService;

    @Transactional
    public MemoryDto createMemory(Long tripId, MemoryDto dto) {
        Trip trip = tripService.getTripEntity(tripId);
        Memory memory = Memory.builder()
                .trip(trip)
                .placeName(dto.getPlaceName())
                .photoUrl(dto.getPhotoUrl())
                .visitDate(dto.getVisitDate())
                .notes(dto.getNotes())
                .expenseAmount(dto.getExpenseAmount())
                .emotionTag(dto.getEmotionTag() != null ? dto.getEmotionTag().toUpperCase() : "JOYFUL")
                .build();
        return toDto(memoryRepository.save(memory));
    }

    public List<MemoryDto> getTripMemories(Long tripId) {
        return memoryRepository.findByTripIdOrderByVisitDateDescCreatedAtDesc(tripId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteMemory(Long memoryId) {
        memoryRepository.deleteById(memoryId);
    }

    private MemoryDto toDto(Memory memory) {
        return MemoryDto.builder()
                .id(memory.getId())
                .tripId(memory.getTrip().getId())
                .placeName(memory.getPlaceName())
                .photoUrl(memory.getPhotoUrl())
                .visitDate(memory.getVisitDate())
                .notes(memory.getNotes())
                .expenseAmount(memory.getExpenseAmount())
                .emotionTag(memory.getEmotionTag())
                .createdAt(memory.getCreatedAt())
                .build();
    }
}
