package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "memories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Memory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String placeName;

    private String photoUrl;

    private LocalDate visitDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private Double expenseAmount;

    @Column(length = 50)
    private String emotionTag; // JOYFUL, PEACEFUL, ADVENTUROUS, INSPIRING, DELICIOUS

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.visitDate == null) {
            this.visitDate = LocalDate.now();
        }
    }
}
