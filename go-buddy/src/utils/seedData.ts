/**
 * Seed data identifiers for filtering demo/seed data in normal mode
 * These emails correspond to users created by the backend seed script
 */

export const SEED_USER_EMAILS = new Set([
  // Demo user
  'demo@uw.edu',

  // Mock users (IDs 2-12)
  'dubs_cute@uw.edu',
  'sarah.j@uw.edu', // Sarah Johnson
  'mike.chen@uw.edu',
  'emily.park@uw.edu',
  'alex.rodriguez@uw.edu',
  'jessica.kim@uw.edu',
  'david.nguyen@uw.edu',
  'rachel.brown@uw.edu',
  'james.lee@uw.edu',
  'olivia.white@uw.edu',
  'chris.davis@uw.edu',
  'sophia.martinez@uw.edu',
  'nathan.brooks@uw.edu',
  'maria.gonzalez@uw.edu',
  'kevin.huang@uw.edu',
  'amanda.taylor@uw.edu',
  'ryan.patel@uw.edu',
  'jennifer.liu@uw.edu',
  'tyler.anderson@uw.edu',
  'nicole.santos@uw.edu',
  'brandon.lee@uw.edu',
  'stephanie.wright@uw.edu',

  // Activity creator users
  'sarah.chen@uw.edu',
  'mike.johnson@uw.edu',
  'emily.rodriguez@uw.edu',
  'david.kim@uw.edu',
  'lisa.wang@uw.edu',
  'alex.thompson@uw.edu',
  'zoe.garcia@uw.edu',
  'tom.williams@uw.edu',
  'maya.patel@uw.edu',
  'carlos.rivera@uw.edu',
]);

/**
 * Check if a user email is from seed data
 */
export function isSeedUser(email: string): boolean {
  return SEED_USER_EMAILS.has(email);
}

/**
 * Check if user is in demo mode
 */
export function isDemoMode(userEmail: string): boolean {
  return userEmail === 'demo@uw.edu';
}
