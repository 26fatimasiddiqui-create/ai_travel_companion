package com.travelcompanion.repository;

import com.travelcompanion.entity.GroupTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GroupTripRepository extends JpaRepository<GroupTrip, Long> {
    Optional<GroupTrip> findByTripId(Long tripId);
    Optional<GroupTrip> findByInviteCode(String inviteCode);
}
