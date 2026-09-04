package com.travelcompanion.service;

import lombok.Builder;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LocationService {

    @Value("${app.maps.api-key:}")
    private String mapsApiKey;

    @Data
    @Builder
    public static class SafetyReport {
        private Integer overallScore; // 1-100
        private String safetyLevel;   // HIGH, MODERATE, CAUTION
        private String primaryAdvice;
        private List<EmergencyContact> emergencyContacts;
        private List<NearbyFacility> nearbyPoliceStations;
        private List<NearbyFacility> nearbyHospitals;
        private boolean isEstimated;
    }

    @Data
    @Builder
    public static class EmergencyContact {
        private String name;
        private String phone;
        private String description;
    }

    @Data
    @Builder
    public static class NearbyFacility {
        private String name;
        private String type; // POLICE, HOSPITAL, CLINIC
        private String distance;
        private String contact;
        private Double lat;
        private Double lng;
    }

    public SafetyReport getSafetyReport(String destination, String userProfile) {
        String city = (destination != null) ? destination.toLowerCase() : "jaipur";

        List<NearbyFacility> police = new ArrayList<>();
        List<NearbyFacility> hospitals = new ArrayList<>();
        List<EmergencyContact> contacts = new ArrayList<>();

        contacts.add(EmergencyContact.builder().name("National Emergency Number").phone("112").description("All-in-one emergency dispatch").build());
        contacts.add(EmergencyContact.builder().name("Police Helpline").phone("100").description("Direct police assistance").build());
        contacts.add(EmergencyContact.builder().name("Ambulance / Medical").phone("102").description("Medical emergency dispatch").build());
        contacts.add(EmergencyContact.builder().name("Women Safety Helpline").phone("1091").description("24/7 priority support for women travelers").build());
        contacts.add(EmergencyContact.builder().name("Tourist Helpline").phone("1363").description("Ministry of Tourism 24/7 toll-free").build());

        if (city.contains("jaipur")) {
            police.add(NearbyFacility.builder().name("Manak Chowk Police Station (Walled City)").type("POLICE").distance("450 m").contact("+91-141-2601243").lat(26.9248).lng(75.8272).build());
            police.add(NearbyFacility.builder().name("Ashok Nagar Police Station (Central)").type("POLICE").distance("1.8 km").contact("+91-141-2385100").lat(26.9080).lng(75.8010).build());
            police.add(NearbyFacility.builder().name("Tourist Police Assistance Booth - Hawa Mahal").type("POLICE").distance("120 m").contact("+91-141-2601955").lat(26.9239).lng(75.8267).build());

            hospitals.add(NearbyFacility.builder().name("SMS Government Hospital (Trauma Center)").type("HOSPITAL").distance("2.1 km").contact("+91-141-2560291").lat(26.8978).lng(75.8175).build());
            hospitals.add(NearbyFacility.builder().name("Santokba Durlabhji Memorial Hospital (SDMH)").type("HOSPITAL").distance("3.4 km").contact("+91-141-2566251").lat(26.8895).lng(75.8042).build());
            hospitals.add(NearbyFacility.builder().name("Fortis Escorts Hospital").type("HOSPITAL").distance("6.5 km").contact("+91-141-4097000").lat(26.8520).lng(75.8078).build());
        } else {
            police.add(NearbyFacility.builder().name("Central City Police Station").type("POLICE").distance("800 m").contact("100").lat(28.6139).lng(77.2090).build());
            hospitals.add(NearbyFacility.builder().name("City General Hospital").type("HOSPITAL").distance("1.5 km").contact("102").lat(28.6200).lng(77.2150).build());
        }

        int score = 88;
        String advice = "Daytime travel across central districts is very safe. Stick to well-lit heritage corridors and verified metro/licensed cab transit after 9:30 PM.";

        if ("SOLO".equalsIgnoreCase(userProfile)) {
            score = 86;
            advice = "Solo traveler advisory: Use app-based registered cabs or metro; share live trip itinerary with emergency contacts; keep emergency contacts bookmarked.";
        }

        return SafetyReport.builder()
                .overallScore(score)
                .safetyLevel("HIGH")
                .primaryAdvice(advice)
                .emergencyContacts(contacts)
                .nearbyPoliceStations(police)
                .nearbyHospitals(hospitals)
                .isEstimated(true) // Clearly communicate that score is estimated
                .build();
    }

    public int calculateTransitMinutes(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return 15; // default 15 mins transit
        }
        // Haversine formula
        double R = 6371; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        double distanceKm = R * c;

        // Approx 25 km/h urban travel with traffic cushion
        int minutes = (int) Math.round((distanceKm / 25.0) * 60) + 5;
        return Math.max(5, Math.min(minutes, 90));
    }
}
