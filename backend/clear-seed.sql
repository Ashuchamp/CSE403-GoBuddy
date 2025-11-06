-- Clear ALL data from database (not just seeded data)
-- WARNING: This deletes EVERYTHING including real user accounts
DELETE FROM connections;
DELETE FROM connection_requests;
DELETE FROM activity_requests;
DELETE FROM activities;
DELETE FROM users;
