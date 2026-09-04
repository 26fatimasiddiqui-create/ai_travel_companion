package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "places")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String destination;

    @Column(nullable = false, length = 150)
    private String name;

    // LANDMARK, HIDDEN_GEM, CAFE, VIEWPOINT, MARKET, MUSEUM, PARK
    @Column(nullable = false, length = 50)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String address;

    private Double latitude;
    private Double longitude;

    private String crowdQuietHours; // e.g. "9:00 AM - 10:30 AM"
    private String crowdModHours;   // e.g. "11:00 AM - 1:00 PM"
    private String crowdPeakHours;  // e.g. "2:00 PM - 5:00 PM"

    @Column(columnDefinition = "TEXT")
    private String accessibilityFeatures; // e.g. "Ramps, Wheelchair friendly, Elevators"

    @Builder.Default
    private Integer safetyScore = 85; // 1-100

    private Double estimatedCost;

    private String imageUrl;

    @Builder.Default
    private Boolean isHiddenGem = false;

    // Suitable moods: RELAXED, ROMANTIC, ADVENTURE, FOOD_LOVER, PHOTOGRAPHY, FAMILY, SOLO
    @Column(length = 100)
    private String suitedMood;
}
