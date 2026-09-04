package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packing_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    // CLOTHING, DOCUMENTS, ELECTRONICS, HEALTH, GEAR, ESSENTIALS
    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false)
    private String itemName;

    @Builder.Default
    private Boolean isPacked = false;

    private String weatherTrigger; // e.g. "Triggered by forecasted rain"
}
