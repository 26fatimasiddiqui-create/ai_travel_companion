package com.travelcompanion.repository;

import com.travelcompanion.entity.GroupVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupVoteRepository extends JpaRepository<GroupVote, Long> {
    List<GroupVote> findByGroupTripId(Long groupTripId);
}
