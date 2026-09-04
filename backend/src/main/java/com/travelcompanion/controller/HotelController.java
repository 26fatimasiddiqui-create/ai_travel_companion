package com.travelcompanion.controller;

import com.travelcompanion.dto.ApiResponse;
import com.travelcompanion.entity.Hotel;
import com.travelcompanion.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelRepository hotelRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hotel>>> getHotels(
            @RequestParam(required = false, defaultValue = "Jaipur") String destination) {
        List<Hotel> hotels = hotelRepository.findByDestinationIgnoreCase(destination);
        return ResponseEntity.ok(ApiResponse.success(hotels));
    }
}
