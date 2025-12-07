import {User} from '../types';

/**
 * Checks if a user has at least one contact method filled in
 * @param user - The user object to check
 * @returns true if user has at least one contact method (phone, instagram, or contactEmail)
 */
export function hasContactInfo(user: User | null): boolean {
  if (!user) return false;

  return (
    !!(user.phone && user.phone.trim() !== '') ||
    !!(user.instagram && user.instagram.trim() !== '') ||
    !!(user.contactEmail && user.contactEmail.trim() !== '')
  );
}

/**
 * Checks if a user has a valid name
 * @param user - The user object to check
 * @returns true if user has a non-empty name
 */
export function hasValidName(user: User | null): boolean {
  if (!user) return false;
  return !!(user.name && user.name.trim() !== '');
}

/**
 * Checks if a user has complete profile information required for connecting/joining
 * @param user - The user object to check
 * @returns true if user has both name and at least one contact method
 */
export function hasCompleteProfile(user: User | null): boolean {
  return hasValidName(user) && hasContactInfo(user);
}
