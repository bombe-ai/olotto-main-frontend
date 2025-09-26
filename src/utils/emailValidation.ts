import validator from "validator";

// Email validation result interface
export interface EmailValidationResult {
  isValid: boolean;
  errorType: "format" | "disposable" | "invalid" | null;
  message: string;
}

// Comprehensive list of disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  // 10-minute mail services
  "10minutemail.com",
  "10minemail.com",
  "20minutemail.com",
  "2prong.com",
  // Temp mail services
  "tempmail.org",
  "temp-mail.org",
  "tempmailaddress.com",
  "tempmailer.com",
  "tempemail.com",
  "tempinbox.com",
  "temp-mail.io",
  "tempail.com",
  // Guerrilla mail
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamailblock.com",
  "guerrillamail.de",
  "grr.la",
  "sharklasers.com",
  // Mailinator
  "mailinator.com",
  "mailinator.net",
  "mailinator.org",
  "mailinator2.com",
  "sogetthis.com",
  "suremail.info",
  "misterpinball.de",
  "notmailinator.com",
  // Throwaway
  "throwaway.email",
  "throwawaymailbox.com",
  "trashmail.com",
  "trashymail.com",
  // Other popular services
  "yopmail.com",
  "yopmail.fr",
  "cool.fr.nf",
  "jetable.fr.nf",
  "emailondeck.com",
  "emailfake.com",
  "fakemailgenerator.com",
  "fakemail.net",
  "dispostable.com",
  "disposable-email.ml",
  "disposableemailaddresses.com",
  "maildrop.cc",
  "mailcatch.com",
  "mailnesia.com",
  "mohmal.com",
  "getnada.com",
  "spambox.us",
  "spamfree24.org",
  "spamfree24.de",
  "minuteinbox.com",
  "mintemail.com",
  "mytrashmail.com",
  "anonymbox.com",
  // Recently popular ones
  "cock.li",
  "airmail.cc",
  "anonbox.net",
  "bugmenot.com",
  "deadaddress.com",
  "despam.it",
  "disposeamail.com",
  "discard.email",
  "dumpyemail.com",
  "incognitomail.org",
  "mail-temporaire.fr",
  "mailtemp.info",
  "rootfest.net",
  "spambog.com",
  "spambog.de",
  "spambog.ru",
  "spamgourmet.com",
  "spamgourmet.net",
  "spamgourmet.org",
  "spamhole.com",
  "spamify.com",
  "spammotel.com",
  "spaml.com",
  "spamspot.com",
  "tempymail.com",
  "zoemail.org",
];

// Suspicious patterns for disposable email detection
const SUSPICIOUS_PATTERNS = [
  "temp",
  "disposable",
  "throw",
  "fake",
  "spam",
  "trash",
];

/**
 * Checks if an email domain is in the disposable email list
 */
const isDisposableDomain = (domain: string): boolean => {
  const domainLower = domain.toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.includes(domainLower);
};

/**
 * Checks if an email domain matches suspicious patterns
 */
const hasSuspiciousPattern = (domain: string): boolean => {
  const domainLower = domain.toLowerCase();
  return SUSPICIOUS_PATTERNS.some((pattern) => domainLower.includes(pattern));
};

/**
 * Comprehensive email validation function
 * Validates email format, length constraints, and detects disposable emails
 *
 * @param email - The email address to validate
 * @returns EmailValidationResult with validation status and error details
 */
export const validateEmailComprehensive = (
  email: string
): EmailValidationResult => {
  // Basic checks
  if (!email.trim()) {
    return {
      isValid: false,
      errorType: "invalid",
      message: "Email is required",
    };
  }

  // Length check - RFC 5321 limits
  if (email.length > 254) {
    return {
      isValid: false,
      errorType: "format",
      message: "Email is too long",
    };
  }

  // Format validation using validator.js (more robust than regex)
  if (!validator.isEmail(email)) {
    return {
      isValid: false,
      errorType: "format",
      message: "Please enter a valid email address",
    };
  }

  // Additional format checks
  const emailParts = email.split("@");
  if (emailParts.length !== 2) {
    return {
      isValid: false,
      errorType: "format",
      message: "Invalid email format",
    };
  }

  const [localPart, domain] = emailParts;

  // Local part validation - RFC 5321 limits
  if (localPart.length > 64) {
    return {
      isValid: false,
      errorType: "format",
      message: "Email username is too long",
    };
  }

  // Domain validation - RFC 5321 limits
  if (domain.length > 253) {
    return {
      isValid: false,
      errorType: "format",
      message: "Email domain is too long",
    };
  }

  // Check for consecutive dots (not allowed in email)
  if (email.includes("..")) {
    return {
      isValid: false,
      errorType: "format",
      message: "Invalid email format",
    };
  }

  // Check for leading/trailing dots in local part (not allowed)
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return {
      isValid: false,
      errorType: "format",
      message: "Invalid email format",
    };
  }

  // Disposable email detection - exact domain match
  if (isDisposableDomain(domain)) {
    return {
      isValid: false,
      errorType: "disposable",
      message: "Please use a permanent email address",
    };
  }

  // Disposable email detection - suspicious pattern match
  if (hasSuspiciousPattern(domain)) {
    return {
      isValid: false,
      errorType: "disposable",
      message: "Please use a permanent email address",
    };
  }

  // All validations passed
  return { isValid: true, errorType: null, message: "" };
};

/**
 * Simple email format validation (lightweight alternative)
 * Uses only validator.js without disposable email checks
 *
 * @param email - The email address to validate
 * @returns boolean indicating if email format is valid
 */
export const validateEmailFormat = (email: string): boolean => {
  return validator.isEmail(email.trim());
};

/**
 * Check if email is from a disposable email provider
 *
 * @param email - The email address to check
 * @returns boolean indicating if email is disposable
 */
export const isDisposableEmail = (email: string): boolean => {
  if (!email || !email.includes("@")) return false;

  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  return isDisposableDomain(domain) || hasSuspiciousPattern(domain);
};
