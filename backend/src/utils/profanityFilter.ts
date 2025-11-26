/**
 * Profanity Filter Utility
 * Checks text content for inappropriate language
 * Uses the 'leo-profanity' package to avoid hardcoding profanity lists
 */

import LeoProfanity from 'leo-profanity';

// Optionally add custom words specific to your platform
// LeoProfanity.add(['customword1', 'customword2']);

// Optionally remove words that you don't want to filter
// LeoProfanity.remove(['word1', 'word2']);

/**
 * Check if text contains profanity
 * Uses the leo-profanity library which maintains an external word list
 * @param text - The text to check
 * @returns true if profanity is found, false otherwise
 */
export const containsProfanity = (text: string): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  // The leo-profanity library checks for profanity
  return LeoProfanity.check(text);
};

/**
 * Check multiple text fields for profanity
 * @param fields - Object with field names and their values
 * @returns Array of field names that contain profanity
 */
export const checkFieldsForProfanity = (fields: Record<string, string | string[] | undefined>): string[] => {
  const violatingFields: string[] = [];
  
  for (const [fieldName, value] of Object.entries(fields)) {
    if (typeof value === 'string' && containsProfanity(value)) {
      violatingFields.push(fieldName);
    } else if (Array.isArray(value)) {
      // Check each item in array (for skills, tags, etc.)
      for (const item of value) {
        if (typeof item === 'string' && containsProfanity(item)) {
          violatingFields.push(fieldName);
          break;
        }
      }
    }
  }
  
  return violatingFields;
};

/**
 * Validate user input fields for profanity
 * @param data - User data to validate
 * @returns Object with isValid boolean and violatingFields array
 */
export const validateUserInput = (data: {
  name?: string;
  bio?: string;
  skills?: string[];
  activityTags?: string[];
  instagram?: string;
  campusLocation?: string;
  contactEmail?: string;
  preferredTimes?: string[];
}): { isValid: boolean; violatingFields: string[] } => {
  const fieldsToCheck: Record<string, string | string[]> = {};
  
  if (data.name) fieldsToCheck.name = data.name;
  if (data.bio) fieldsToCheck.bio = data.bio;
  if (data.skills) fieldsToCheck.skills = data.skills;
  if (data.activityTags) fieldsToCheck.activityTags = data.activityTags;
  if (data.instagram) fieldsToCheck.instagram = data.instagram;
  if (data.campusLocation) fieldsToCheck.campusLocation = data.campusLocation;
  if (data.contactEmail) fieldsToCheck.contactEmail = data.contactEmail;
  if (data.preferredTimes) fieldsToCheck.preferredTimes = data.preferredTimes;
  
  const violatingFields = checkFieldsForProfanity(fieldsToCheck);
  
  return {
    isValid: violatingFields.length === 0,
    violatingFields,
  };
};

/**
 * Validate activity input fields for profanity
 * @param data - Activity data to validate
 * @returns Object with isValid boolean and violatingFields array
 */
export const validateActivityInput = (data: {
  title?: string;
  description?: string;
  userName?: string;
  campusLocation?: string;
}): { isValid: boolean; violatingFields: string[] } => {
  const fieldsToCheck: Record<string, string> = {};
  
  if (data.title) fieldsToCheck.title = data.title;
  if (data.description) fieldsToCheck.description = data.description;
  if (data.userName) fieldsToCheck.userName = data.userName;
  if (data.campusLocation) fieldsToCheck.campusLocation = data.campusLocation;
  
  const violatingFields = checkFieldsForProfanity(fieldsToCheck);
  
  return {
    isValid: violatingFields.length === 0,
    violatingFields,
  };
};

/**
 * Validate connection request message for profanity
 * @param message - Message to validate
 * @returns Object with isValid boolean and violatingFields array
 */
export const validateConnectionMessage = (message?: string): { isValid: boolean; violatingFields: string[] } => {
  if (!message) {
    return { isValid: true, violatingFields: [] };
  }
  
  const hasProfanity = containsProfanity(message);
  
  return {
    isValid: !hasProfanity,
    violatingFields: hasProfanity ? ['message'] : [],
  };
};
