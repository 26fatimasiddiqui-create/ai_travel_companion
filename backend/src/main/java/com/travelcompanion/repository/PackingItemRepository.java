package com.travelcompanion.repository;

import com.travelcompanion.entity.PackingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PackingItemRepository extends JpaRepository<PackingItem, Long> {
    List<PackingItem> findByTripIdOrderByCategoryAsc(Long tripId);
    void deleteByTripId(Long tripId);
}
