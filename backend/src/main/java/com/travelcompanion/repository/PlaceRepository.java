package com.travelcompanion.repository;

import com.travelcompanion.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByDestinationIgnoreCase(String destination);
    List<Place> findByDestinationIgnoreCaseAndIsHiddenGemTrue(String destination);
    List<Place> findByIsHiddenGemTrue();
}
