import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates user initials from available data
 * Priority: firstName + lastName > email > name > default
 *
 * @param options - Object containing user data
 * @param options.firstName - User's first name
 * @param options.lastName - User's last name
 * @param options.email - User's email address (used as fallback)
 * @param options.name - User's full name (used as fallback)
 * @param options.default - Default initials if nothing else is available (default: 'U')
 * @returns Uppercase initials string
 */
export function getInitials({
  firstName,
  lastName,
  email,
  name,
  default: defaultInitials = 'U',
}: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  name?: string | null;
  default?: string;
}): string {
  // Priority 1: Use firstName + lastName if both available
  if (firstName && lastName) {
    const first = firstName.trim().charAt(0).toUpperCase();
    const last = lastName.trim().charAt(0).toUpperCase();
    if (first && last) {
      return `${first}${last}`;
    }
    // If only one is available, use it twice
    if (first) return `${first}${first}`;
    if (last) return `${last}${last}`;
  }

  // Priority 2: Parse email address
  if (email) {
    const emailParts = email.split('@')[0].split('.');
    if (emailParts.length >= 2) {
      const first = emailParts[0].charAt(0).toUpperCase();
      const second = emailParts[1].charAt(0).toUpperCase();
      if (first && second) {
        return `${first}${second}`;
      }
    }
    // Fallback: use first 2 characters of email
    const emailInitials = email.substring(0, 2).toUpperCase();
    if (emailInitials.length >= 2) {
      return emailInitials;
    }
  }

  // Priority 3: Use name (first character)
  if (name) {
    const firstChar = name.trim().charAt(0).toUpperCase();
    if (firstChar) {
      return `${firstChar}${firstChar}`;
    }
  }

  // Priority 4: Default
  return defaultInitials.toUpperCase();
}
