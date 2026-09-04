package com.travelcompanion.repository;

import com.travelcompanion.entity.CompanionAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompanionAlertRepository extends JpaRepository<CompanionAlert, Long> {
    List<CompanionAlert> findByTripIdOrderByCreatedAtDesc(Long tripId);
    List<CompanionAlert> findByTripIdAndStatus(Long tripId, String status);
}
