package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_votes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_trip_id", nullable = false)
    private GroupTrip groupTrip;

    @Column(nullable = false, length = 100)
    private String voterName;

    @Column(columnDefinition = "TEXT")
    private String preferredPlaces; // comma-separated or json

    @Column(columnDefinition = "TEXT")
    private String preferredActivities;

    private Double budgetCap;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
