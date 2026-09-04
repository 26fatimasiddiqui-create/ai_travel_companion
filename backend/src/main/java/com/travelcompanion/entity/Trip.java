package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private Double budget;

    @Builder.Default
    private Integer travelersCount = 1;

    // SOLO, COUPLE, FAMILY, GROUP
    @Column(length = 50)
    @Builder.Default
    private String travelType = "SOLO";

    // RELAXED, ROMANTIC, ADVENTURE, FAMILY, SOLO, PHOTOGRAPHY, FOOD_LOVER
    @Column(length = 50)
    @Builder.Default
    private String mood = "RELAXED";

    // NONE, WHEELCHAIR, SENIOR, YOUNG_FAMILY
    @Column(length = 50)
    @Builder.Default
    private String accessibilityProfile = "NONE";

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(columnDefinition = "TEXT")
    private String accommodationPreference;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
