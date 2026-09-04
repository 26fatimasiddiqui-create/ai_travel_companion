package com.travelcompanion.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemoryDto {
    private Long id;
    private Long tripId;
    private String placeName;
    private String photoUrl;
    private LocalDate visitDate;
    private String notes;
    private Double expenseAmount;
    private String emotionTag;
    private LocalDateTime createdAt;
}
