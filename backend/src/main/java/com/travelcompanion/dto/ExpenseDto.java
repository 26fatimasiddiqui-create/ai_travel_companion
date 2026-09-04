package com.travelcompanion.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseDto {
    private Long id;
    private Long tripId;
    private String title;
    private String category;
    private Double amount;
    private Boolean isPlanned;
    private LocalDate expenseDate;
    private String notes;
}
