package com.travelcompanion.repository;

import com.travelcompanion.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByTripIdOrderByExpenseDateDescCreatedAtDesc(Long tripId);

    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.trip.id = :tripId AND e.isPlanned = false")
    Double sumActualExpensesByTripId(@Param("tripId") Long tripId);

    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.trip.id = :tripId AND e.isPlanned = true")
    Double sumPlannedExpensesByTripId(@Param("tripId") Long tripId);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.trip.id = :tripId GROUP BY e.category")
    List<Object[]> sumExpensesByCategory(@Param("tripId") Long tripId);
}
