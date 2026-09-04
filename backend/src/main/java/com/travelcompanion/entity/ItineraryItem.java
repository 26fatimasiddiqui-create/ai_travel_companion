package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "itinerary_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private Integer dayNumber;

    @Column(nullable = false, length = 20)
    private String startTime; // e.g. "09:00 AM"

    @Column(nullable = false, length = 20)
    private String endTime;   // e.g. "10:30 AM"

    @Column(nullable = false)
    private String placeName;

    @Column(length = 50)
    private String category; // SIGHTSEEING, FOOD, TRANSIT, REST, HIDDEN_GEM

    private Integer durationMinutes;

    private Integer travelTimeMinutes;

    private Double estimatedCost;

    @Column(columnDefinition = "TEXT")
    private String recommendationReason;

    @Column(columnDefinition = "TEXT")
    private String weatherConsideration;

    // QUIET, MODERATE, CROWDED
    @Column(length = 30)
    private String crowdLevel;

    @Column(columnDefinition = "TEXT")
    private String accessibilityNote;

    @Column(columnDefinition = "TEXT")
    private String safetyNote;

    @Builder.Default
    private Boolean isCompleted = false;

    private Double latitude;
    private Double longitude;
}
