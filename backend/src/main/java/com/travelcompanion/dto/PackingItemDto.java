package com.travelcompanion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackingItemDto {
    private Long id;
    private Long tripId;
    private String category;
    private String itemName;
    private Boolean isPacked;
    private String weatherTrigger;
}
