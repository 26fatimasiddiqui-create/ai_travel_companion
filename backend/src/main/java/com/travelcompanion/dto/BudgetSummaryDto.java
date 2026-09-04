package com.travelcompanion.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetSummaryDto {
    private Double totalBudget;
    private Double totalPlanned;
    private Double totalActual;
    private Double remainingBudget;
    private Double projectedCost;
    private Boolean isOverBudget;
    private Double overBudgetAmount;
    private Map<String, Double> categorySpending;
    private List<BudgetOptimizationDto> optimizationSuggestions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BudgetOptimizationDto {
        private String originalItem;
        private Double originalCost;
        private String suggestedItem;
        private Double suggestedCost;
        private Double potentialSavings;
        private String category;
        private String reason;
    }
}
