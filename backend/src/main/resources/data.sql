-- ====================================================================
-- AI Travel Companion Initial Seed Data (MySQL Compatible)
-- ====================================================================

-- Places & Attractions are seeded below or via DataInitializerService

-- Seed Landmark & Hidden Gem Places
INSERT INTO places (id, destination, name, category, description, address, latitude, longitude, crowd_quiet_hours, crowd_mod_hours, crowd_peak_hours, accessibility_features, safety_score, estimated_cost, image_url, is_hidden_gem, suited_mood)
SELECT 1, 'Jaipur', 'Hawa Mahal (Palace of Winds)', 'LANDMARK', 'Iconic 5-story pink honeycomb facade built in 1799 with 953 intricate jharokhas.', 'Hawa Mahal Rd, Badi Choupad, Jaipur', 26.9239, 75.8267, '08:30 AM - 10:00 AM', '10:30 AM - 01:30 PM', '02:00 PM - 05:00 PM', 'Ground-level courtyards accessible', 92, 100.0, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', FALSE, 'PHOTOGRAPHY, RELAXED'
WHERE NOT EXISTS (SELECT 1 FROM places WHERE id = 1);

INSERT INTO places (id, destination, name, category, description, address, latitude, longitude, crowd_quiet_hours, crowd_mod_hours, crowd_peak_hours, accessibility_features, safety_score, estimated_cost, image_url, is_hidden_gem, suited_mood)
SELECT 2, 'Jaipur', 'Panna Meena Ka Kund', 'HIDDEN_GEM', '16th-century symmetrical geometric stepwell tucked beside Amber.', 'Near Amber Fort, Amer, Jaipur', 26.9850, 75.8580, '08:00 AM - 11:00 AM', '11:30 AM - 02:00 PM', '03:00 PM - 05:30 PM', 'Terrace overlook accessible', 88, 50.0, 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80', TRUE, 'PHOTOGRAPHY, ADVENTURE, RELAXED'
WHERE NOT EXISTS (SELECT 1 FROM places WHERE id = 2);

INSERT INTO places (id, destination, name, category, description, address, latitude, longitude, crowd_quiet_hours, crowd_mod_hours, crowd_peak_hours, accessibility_features, safety_score, estimated_cost, image_url, is_hidden_gem, suited_mood)
SELECT 3, 'Jaipur', 'Anokhi Museum of Hand Printing', 'HIDDEN_GEM', 'Restored haveli dedicated to the craft of block printing with live master demos.', 'Kheri Gate, Amer, Jaipur', 26.9902, 75.8560, '10:00 AM - 12:00 PM', '12:00 PM - 02:30 PM', '03:00 PM - 04:30 PM', 'Ramps at ground floor', 90, 150.0, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', TRUE, 'RELAXED, ROMANTIC, SOLO'
WHERE NOT EXISTS (SELECT 1 FROM places WHERE id = 3);
