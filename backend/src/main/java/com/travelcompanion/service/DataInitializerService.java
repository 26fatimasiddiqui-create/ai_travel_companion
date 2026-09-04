package com.travelcompanion.service;

import com.travelcompanion.dto.TripRequest;
import com.travelcompanion.entity.*;
import com.travelcompanion.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializerService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PlaceRepository placeRepository;
    private final HotelRepository hotelRepository;
    private final TripRepository tripRepository;
    private final TripService tripService;
    private final ItineraryService itineraryService;
    private final ExpenseRepository expenseRepository;
    private final MemoryRepository memoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            initUsers();
            initPlaces();
            initHotels();
            initDemoTrip();
            log.info("AI Travel Companion seed data initialized successfully.");
        } catch (Exception e) {
            log.error("Error during seed data initialization: {}", e.getMessage(), e);
        }
    }

    private void initUsers() {
        User demo = userRepository.findByEmail("demo@travelcompanion.ai").orElse(null);
        if (demo == null) {
            demo = User.builder()
                    .email("demo@travelcompanion.ai")
                    .fullName("Aarav Sharma")
                    .role("ROLE_USER")
                    .travelPreferences("Heritage architecture, local artisan street food, photography, relaxed pacing")
                    .build();
        }
        demo.setPassword(passwordEncoder.encode("password123"));
        userRepository.save(demo);
    }

    private void initPlaces() {
        if (placeRepository.count() == 0) {
            List<Place> places = List.of(
                Place.builder()
                    .destination("Jaipur")
                    .name("Hawa Mahal (Palace of Winds)")
                    .category("LANDMARK")
                    .description("Iconic 5-story pink honeycomb facade built in 1799 with 953 intricate jharokhas designed for royal women to observe street festivals unnoticed.")
                    .address("Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur")
                    .latitude(26.9239).longitude(75.8267)
                    .crowdQuietHours("08:30 AM - 10:00 AM")
                    .crowdModHours("10:30 AM - 01:30 PM")
                    .crowdPeakHours("02:00 PM - 05:00 PM")
                    .accessibilityFeatures("Ground-level courtyards accessible; upper chambers have ramps and shallow stairs")
                    .safetyScore(92)
                    .estimatedCost(100.0)
                    .imageUrl("https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80")
                    .isHiddenGem(false)
                    .suitedMood("PHOTOGRAPHY, RELAXED")
                    .build(),

                Place.builder()
                    .destination("Jaipur")
                    .name("Panna Meena Ka Kund")
                    .category("HIDDEN_GEM")
                    .description("16th-century symmetrical geometric stepwell tucked beside Anokhi Museum. Famed for crisscross stairways and calm, cool acoustic courtyards.")
                    .address("Near Amber Fort, Amer, Jaipur")
                    .latitude(26.9850).longitude(75.8580)
                    .crowdQuietHours("08:00 AM - 11:00 AM")
                    .crowdModHours("11:30 AM - 02:00 PM")
                    .crowdPeakHours("03:00 PM - 05:30 PM")
                    .accessibilityFeatures("Terrace overlook is accessible; steps into well are historic stone")
                    .safetyScore(88)
                    .estimatedCost(50.0)
                    .imageUrl("https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80")
                    .isHiddenGem(true)
                    .suitedMood("PHOTOGRAPHY, ADVENTURE, RELAXED")
                    .build(),

                Place.builder()
                    .destination("Jaipur")
                    .name("Anokhi Museum of Hand Printing")
                    .category("HIDDEN_GEM")
                    .description("Restored Chanwar Palki Haveli devoted to traditional woodblock printing techniques. Features live master printer demonstrations.")
                    .address("Kheri Gate, Amer, Jaipur")
                    .latitude(26.9902).longitude(75.8560)
                    .crowdQuietHours("10:00 AM - 12:00 PM")
                    .crowdModHours("12:00 PM - 02:30 PM")
                    .crowdPeakHours("03:00 PM - 04:30 PM")
                    .accessibilityFeatures("Ground floor gallery and cafe ramp access")
                    .safetyScore(90)
                    .estimatedCost(150.0)
                    .imageUrl("https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80")
                    .isHiddenGem(true)
                    .suitedMood("RELAXED, ROMANTIC, SOLO")
                    .build(),

                Place.builder()
                    .destination("Jaipur")
                    .name("Gaitore Ki Chhatriyan")
                    .category("HIDDEN_GEM")
                    .description("Quiet valley of ornate white marble cenotaphs commemorating the Kachwaha rulers. Serene, uncrowded, with exquisite stone carvings.")
                    .address("Khuran Ka Rasta, Brahampuri, Jaipur")
                    .latitude(26.9421).longitude(75.8279)
                    .crowdQuietHours("09:00 AM - 12:00 PM")
                    .crowdModHours("12:00 PM - 03:00 PM")
                    .crowdPeakHours("03:30 PM - 05:00 PM")
                    .accessibilityFeatures("Flat paved pathways throughout main garden pavilion")
                    .safetyScore(87)
                    .estimatedCost(60.0)
                    .imageUrl("https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80")
                    .isHiddenGem(true)
                    .suitedMood("RELAXED, PHOTOGRAPHY, ROMANTIC")
                    .build(),

                Place.builder()
                    .destination("Jaipur")
                    .name("LMB Sweet Shop & Restaurant")
                    .category("CAFE")
                    .description("Established in 1727 in the historic Johari Bazaar, celebrated for authentic Paneer Ghewar, Pyaaz Kachori, and royal Rajasthani thalis.")
                    .address("Johari Bazar Rd, Pink City, Jaipur")
                    .latitude(26.9212).longitude(75.8270)
                    .crowdQuietHours("09:00 AM - 11:30 AM")
                    .crowdModHours("12:00 PM - 03:00 PM")
                    .crowdPeakHours("07:00 PM - 09:30 PM")
                    .accessibilityFeatures("Street level entrance, air-conditioned family dining")
                    .safetyScore(94)
                    .estimatedCost(350.0)
                    .imageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80")
                    .isHiddenGem(false)
                    .suitedMood("FOOD_LOVER, FAMILY")
                    .build(),

                Place.builder()
                    .destination("Jaipur")
                    .name("Nahargarh Fort & Padao Sunset Point")
                    .category("VIEWPOINT")
                    .description("Standing on the edge of the Aravalli hills, providing a breathtaking sunset panorama over the entire Pink City.")
                    .address("Krishna Nagar, Brahampuri, Jaipur")
                    .latitude(26.9372).longitude(75.8155)
                    .crowdQuietHours("10:00 AM - 02:00 PM")
                    .crowdModHours("03:00 PM - 04:30 PM")
                    .crowdPeakHours("05:00 PM - 06:45 PM")
                    .accessibilityFeatures("Direct road access with vehicles able to drive up to ticket plaza")
                    .safetyScore(85)
                    .estimatedCost(100.0)
                    .imageUrl("https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80")
                    .isHiddenGem(false)
                    .suitedMood("ROMANTIC, ADVENTURE, PHOTOGRAPHY")
                    .build()
            );
            placeRepository.saveAll(places);
        }
    }

    private void initHotels() {
        if (hotelRepository.count() == 0) {
            List<Hotel> hotels = List.of(
                Hotel.builder()
                    .destination("Jaipur")
                    .name("Heritage Haveli Palace")
                    .address("Subhash Chowk, Near Badi Chaupar, Jaipur")
                    .pricePerNight(2800.0)
                    .rating(4.7)
                    .isAccessible(true)
                    .amenities("Free WiFi, Traditional Courtyard Dining, Wheelchair Ramps, Airport Shuttle, Heritage Suites")
                    .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80")
                    .build(),
                Hotel.builder()
                    .destination("Jaipur")
                    .name("Shahpura House Heritage Stay")
                    .address("D-257, Devi Marg, Bani Park, Jaipur")
                    .pricePerNight(3600.0)
                    .rating(4.8)
                    .isAccessible(true)
                    .amenities("Swimming Pool, Rooftop Sitar Evenings, Elevator, Organic Breakfast")
                    .imageUrl("https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80")
                    .build()
            );
            hotelRepository.saveAll(hotels);
        }
    }

    private void initDemoTrip() {
        if (tripRepository.count() == 0) {
            User demoUser = userRepository.findByEmail("demo@travelcompanion.ai").orElse(null);
            if (demoUser == null) return;

            Trip trip = Trip.builder()
                    .user(demoUser)
                    .title("Jaipur Cultural Odyssey")
                    .destination("Jaipur")
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusDays(2))
                    .budget(5000.0)
                    .travelersCount(1)
                    .travelType("SOLO")
                    .mood("RELAXED")
                    .accessibilityProfile("NONE")
                    .interests("Heritage monuments, photography, local street cuisine, stepwells")
                    .accommodationPreference("Heritage boutique hotel")
                    .build();

            trip = tripRepository.save(trip);

            // Generate itinerary items & companion alerts
            itineraryService.generateAndSaveItinerary(trip.getId());

            // Add demo expenses
            List<Expense> expenses = List.of(
                Expense.builder().trip(trip).title("Hotel Advance Booking (1st Night)").category("HOTEL").amount(1800.0).isPlanned(false).notes("Heritage room with courtyard view").build(),
                Expense.builder().trip(trip).title("Hawa Mahal Composite Entry Ticket").category("TICKETS").amount(100.0).isPlanned(false).notes("Includes camera pass").build(),
                Expense.builder().trip(trip).title("Morning Chai & Pyaaz Kachori at LMB").category("FOOD").amount(160.0).isPlanned(false).notes("Traditional breakfast").build(),
                Expense.builder().trip(trip).title("Pink Metro Smart Card Recharge").category("TRANSPORT").amount(150.0).isPlanned(false).notes("Multi-trip transit").build(),
                Expense.builder().trip(trip).title("Emergency Medical Pack & Hydration").category("EMERGENCY").amount(120.0).isPlanned(false).notes("Sun care & electrolytes").build()
            );
            expenseRepository.saveAll(expenses);

            // Add demo memory
            Memory memory = Memory.builder()
                    .trip(trip)
                    .placeName("Hawa Mahal Morning Golden Hour")
                    .photoUrl("https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80")
                    .visitDate(LocalDate.now())
                    .notes("Arrived right at 8:45 AM before tourist buses arrived. The early sunlight illuminated the terracotta sandstone beautifully.")
                    .expenseAmount(100.0)
                    .emotionTag("JOYFUL")
                    .build();
            memoryRepository.save(memory);
        }
    }
}
