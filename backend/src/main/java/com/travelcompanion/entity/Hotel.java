package com.travelcompanion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String destination;

    @Column(nullable = false, length = 150)
    private String name;

    private String address;

    private Double pricePerNight;

    private Double rating;

    @Builder.Default
    private Boolean isAccessible = true;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    private String imageUrl;
}
