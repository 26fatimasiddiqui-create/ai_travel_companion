package com.travelcompanion.service;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class WeatherService {

    @Value("${app.weather.api-key:}")
    private String weatherApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Data
    @Builder
    public static class WeatherInfo {
        private String destination;
        private Double temperature;
        private String condition;
        private Integer rainProbability;
        private Integer humidity;
        private Double windSpeed;
        private String advice;
        private boolean isSimulated;
    }

    public WeatherInfo getWeather(String destination, Double lat, Double lon) {
        // Fallback coordinates for prominent travel hubs if lat/lon is null
        double targetLat = lat != null ? lat : getDestinationLat(destination);
        double targetLon = lon != null ? lon : getDestinationLon(destination);

        try {
            // Use Open-Meteo keyless API for real live global weather
            String url = String.format(
                    "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto",
                    targetLat, targetLon
            );
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("current")) {
                Map current = (Map) response.get("current");
                Number temp = (Number) current.get("temperature_2m");
                Number humidity = (Number) current.get("relative_humidity_2m");
                Number precip = (Number) current.get("precipitation");
                Number wind = (Number) current.get("wind_speed_10m");
                Number weatherCode = (Number) current.get("weather_code");

                String condition = decodeWeatherCode(weatherCode != null ? weatherCode.intValue() : 0);
                int rainProb = (precip != null && precip.doubleValue() > 0.0) ? 75 : 10;
                String advice = generateAdvice(condition, temp != null ? temp.doubleValue() : 25.0);

                return WeatherInfo.builder()
                        .destination(destination)
                        .temperature(temp != null ? temp.doubleValue() : 26.0)
                        .condition(condition)
                        .rainProbability(rainProb)
                        .humidity(humidity != null ? humidity.intValue() : 50)
                        .windSpeed(wind != null ? wind.doubleValue() : 8.0)
                        .advice(advice)
                        .isSimulated(false)
                        .build();
            }
        } catch (Exception e) {
            log.warn("Live weather fetch failed for {}: {}. Using resilient weather engine fallback.", destination, e.getMessage());
        }

        // Resilient realistic weather fallback based on destination
        return getFallbackWeather(destination);
    }

    private String decodeWeatherCode(int code) {
        if (code == 0) return "Clear Skies";
        if (code >= 1 && code <= 3) return "Partly Cloudy";
        if (code >= 45 && code <= 48) return "Misty / Foggy";
        if (code >= 51 && code <= 67) return "Light Rain / Showers";
        if (code >= 71 && code <= 77) return "Snow";
        if (code >= 80 && code <= 82) return "Passing Rain Showers";
        if (code >= 95) return "Thunderstorm";
        return "Pleasant";
    }

    private String generateAdvice(String condition, double temp) {
        if (condition.toLowerCase().contains("rain") || condition.toLowerCase().contains("shower")) {
            return "Rain showers forecast. Carry an umbrella or light rain jacket; indoor museums are prioritized.";
        } else if (temp > 32) {
            return "Warm weather. Stay well-hydrated, wear sunscreen, and enjoy cool heritage courtyards midday.";
        } else if (temp < 15) {
            return "Chilly breezes expected. Keep a warm layer handy for morning and evening walks.";
        } else {
            return "Ideal weather conditions for walking tours, outdoor viewpoints, and local exploration.";
        }
    }

    private WeatherInfo getFallbackWeather(String destination) {
        return WeatherInfo.builder()
                .destination(destination)
                .temperature(27.5)
                .condition("Pleasant & Sunny")
                .rainProbability(15)
                .humidity(42)
                .windSpeed(9.5)
                .advice("Mild, pleasant temperature. Excellent for walking tours and heritage photography.")
                .isSimulated(true)
                .build();
    }

    private double getDestinationLat(String destination) {
        if (destination == null) return 26.9124; // Jaipur default
        String d = destination.toLowerCase();
        if (d.contains("jaipur")) return 26.9124;
        if (d.contains("delhi")) return 28.6139;
        if (d.contains("mumbai")) return 19.0760;
        if (d.contains("goa")) return 15.2993;
        if (d.contains("bangalore") || d.contains("bengaluru")) return 12.9716;
        if (d.contains("paris")) return 48.8566;
        if (d.contains("tokyo")) return 35.6762;
        if (d.contains("rome")) return 41.9028;
        return 26.9124;
    }

    private double getDestinationLon(String destination) {
        if (destination == null) return 75.7873; // Jaipur default
        String d = destination.toLowerCase();
        if (d.contains("jaipur")) return 75.7873;
        if (d.contains("delhi")) return 77.2090;
        if (d.contains("mumbai")) return 72.8777;
        if (d.contains("goa")) return 74.1240;
        if (d.contains("bangalore") || d.contains("bengaluru")) return 77.5946;
        if (d.contains("paris")) return 2.3522;
        if (d.contains("tokyo")) return 139.6503;
        if (d.contains("rome")) return 12.4964;
        return 75.7873;
    }
}
