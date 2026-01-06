/**
 * Authentication-related types
 */

// Company invite types
export interface InviteResponseData {
  inviteToken: string;
  companyName: string;
  inviterEmail: string;
}

// Note: Schema types (LoginSchemaType, RegisterSchemaType, etc.) are defined inline
// in their respective component files since they depend on Zod schemas defined there.
// This keeps the types close to where they're used.
