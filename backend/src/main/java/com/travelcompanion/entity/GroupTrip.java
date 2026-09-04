package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false, length = 100)
    private String groupName;

    @Column(nullable = false, unique = true, length = 20)
    private String inviteCode;

    @Column(columnDefinition = "TEXT")
    private String membersJson; // JSON list of members e.g. ["Alex", "Sam", "Rohan"]

    @Column(columnDefinition = "TEXT")
    private String compromiseSummary;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
