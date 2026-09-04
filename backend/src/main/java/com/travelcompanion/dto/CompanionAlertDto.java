package com.travelcompanion.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanionAlertDto {
    private Long id;
    private Long tripId;
    private String alertType; // WEATHER, CLOSING_SOON, TRAFFIC, BUDGET, SAFETY
    private String title;
    private String message;
    private String suggestedAction;
    private String originalItem;
    private String replacementItem;
    private String reasonWhy;
    private String status; // PENDING, ACCEPTED, REJECTED
    private LocalDateTime createdAt;
}
