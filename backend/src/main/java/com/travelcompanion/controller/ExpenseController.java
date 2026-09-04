package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.dto.BudgetSummaryDto;
import com.travelcompanion.dto.ExpenseDto;
import com.travelcompanion.dto.ItineraryItemDto;
import com.travelcompanion.service.BudgetService;
import com.travelcompanion.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpenseController {

    private final BudgetService budgetService;
    private final ItineraryService itineraryService;

    @GetMapping("/trips/{tripId}/expenses")
    public ResponseEntity<ApiResponse<List<ExpenseDto>>> getTripExpenses(@PathVariable Long tripId) {
        List<ExpenseDto> expenses = budgetService.getTripExpenses(tripId);
        return ResponseEntity.ok(ApiResponse.success(expenses));
    }

    @PostMapping("/trips/{tripId}/expenses")
    public ResponseEntity<ApiResponse<ExpenseDto>> addExpense(
            @PathVariable Long tripId,
            @RequestBody ExpenseDto dto) {
        ExpenseDto expense = budgetService.addExpense(tripId, dto);
        return ResponseEntity.ok(ApiResponse.success(expense, "Expense logged successfully"));
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        budgetService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Expense deleted"));
    }

    @GetMapping("/trips/{tripId}/budget/summary")
    public ResponseEntity<ApiResponse<BudgetSummaryDto>> getBudgetSummary(@PathVariable Long tripId) {
        List<ItineraryItemDto> itinerary = itineraryService.getTripItinerary(tripId);
        BudgetSummaryDto summary = budgetService.getBudgetSummary(tripId, itinerary);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
