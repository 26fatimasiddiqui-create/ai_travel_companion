package com.travelcompanion.repository;

import com.travelcompanion.entity.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {
    List<ItineraryItem> findByTripIdOrderByDayNumberAscStartTimeAsc(Long tripId);
    List<ItineraryItem> findByTripIdAndDayNumberOrderByStartTimeAsc(Long tripId, Integer dayNumber);
    void deleteByTripId(Long tripId);
}
