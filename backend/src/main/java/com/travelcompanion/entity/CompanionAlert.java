package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "companion_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanionAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    // WEATHER, CLOSING_SOON, TRAFFIC, BUDGET, SAFETY
    @Column(nullable = false, length = 50)
    private String alertType;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(columnDefinition = "TEXT")
    private String suggestedAction;

    private String originalItem;

    private String replacementItem;

    @Column(columnDefinition = "TEXT")
    private String reasonWhy;

    // PENDING, ACCEPTED, REJECTED
    @Column(length = 20)
    @Builder.Default
    private String status = "PENDING";

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
