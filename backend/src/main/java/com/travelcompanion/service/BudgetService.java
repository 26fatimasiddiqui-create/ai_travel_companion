package com.travelcompanion.service;

import com.travelcompanion.dto.BudgetSummaryDto;
import com.travelcompanion.dto.ExpenseDto;
import com.travelcompanion.dto.ItineraryItemDto;
import com.travelcompanion.entity.Expense;
import com.travelcompanion.entity.Trip;
import com.travelcompanion.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final ExpenseRepository expenseRepository;
    private final TripService tripService;
    private final AIService aiService;

    public BudgetSummaryDto getBudgetSummary(Long tripId, List<ItineraryItemDto> itinerary) {
        Trip trip = tripService.getTripEntity(tripId);
        double totalBudget = trip.getBudget() != null ? trip.getBudget() : 0.0;

        Double totalActual = expenseRepository.sumActualExpensesByTripId(tripId);
        if (totalActual == null) totalActual = 0.0;

        Double totalPlannedExpenses = expenseRepository.sumPlannedExpensesByTripId(tripId);
        if (totalPlannedExpenses == null) totalPlannedExpenses = 0.0;

        // Also factor in itinerary items estimated cost
        double itineraryEstimatedCost = 0.0;
        if (itinerary != null) {
            itineraryEstimatedCost = itinerary.stream()
                    .mapToDouble(i -> i.getEstimatedCost() != null ? i.getEstimatedCost() : 0.0)
                    .sum();
        }

        double projectedCost = totalActual + Math.max(totalPlannedExpenses, itineraryEstimatedCost);
        double remaining = totalBudget - totalActual;
        boolean isOverBudget = projectedCost > totalBudget;
        double overBudgetAmount = isOverBudget ? (projectedCost - totalBudget) : 0.0;

        // Category spending
        Map<String, Double> categoryMap = new LinkedHashMap<>();
        categoryMap.put("HOTEL", 0.0);
        categoryMap.put("FOOD", 0.0);
        categoryMap.put("TRANSPORT", 0.0);
        categoryMap.put("TICKETS", 0.0);
        categoryMap.put("EMERGENCY", 0.0);
        categoryMap.put("OTHER", 0.0);

        List<Object[]> rows = expenseRepository.sumExpensesByCategory(tripId);
        for (Object[] r : rows) {
            String cat = ((String) r[0]).toUpperCase();
            Double amt = (Double) r[1];
            categoryMap.put(cat, amt);
        }

        // Add itinerary item categories if no manual expense is recorded yet
        if (totalActual == 0.0 && itinerary != null) {
            for (ItineraryItemDto item : itinerary) {
                String cat = "TICKETS";
                if ("FOOD".equalsIgnoreCase(item.getCategory())) cat = "FOOD";
                if ("TRANSIT".equalsIgnoreCase(item.getCategory())) cat = "TRANSPORT";
                categoryMap.put(cat, categoryMap.getOrDefault(cat, 0.0) + (item.getEstimatedCost() != null ? item.getEstimatedCost() : 0.0));
            }
        }

        List<BudgetSummaryDto.BudgetOptimizationDto> optimizations = Collections.emptyList();
        if (isOverBudget || projectedCost > (totalBudget * 0.85)) {
            optimizations = aiService.generateBudgetOptimizations(trip, overBudgetAmount);
        }

        return BudgetSummaryDto.builder()
                .totalBudget(totalBudget)
                .totalPlanned(totalPlannedExpenses + itineraryEstimatedCost)
                .totalActual(totalActual)
                .remainingBudget(remaining)
                .projectedCost(projectedCost)
                .isOverBudget(isOverBudget)
                .overBudgetAmount(overBudgetAmount)
                .categorySpending(categoryMap)
                .optimizationSuggestions(optimizations)
                .build();
    }

    @Transactional
    public ExpenseDto addExpense(Long tripId, ExpenseDto dto) {
        Trip trip = tripService.getTripEntity(tripId);
        Expense expense = Expense.builder()
                .trip(trip)
                .title(dto.getTitle())
                .category(dto.getCategory() != null ? dto.getCategory().toUpperCase() : "OTHER")
                .amount(dto.getAmount())
                .isPlanned(Boolean.TRUE.equals(dto.getIsPlanned()))
                .expenseDate(dto.getExpenseDate())
                .notes(dto.getNotes())
                .build();
        return toDto(expenseRepository.save(expense));
    }

    public List<ExpenseDto> getTripExpenses(Long tripId) {
        return expenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteExpense(Long expenseId) {
        expenseRepository.deleteById(expenseId);
    }

    private ExpenseDto toDto(Expense expense) {
        return ExpenseDto.builder()
                .id(expense.getId())
                .tripId(expense.getTrip().getId())
                .title(expense.getTitle())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .isPlanned(expense.getIsPlanned())
                .expenseDate(expense.getExpenseDate())
                .notes(expense.getNotes())
                .build();
    }
}
