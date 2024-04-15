import {
  CountryCode,
  PhoneNumber,
  parsePhoneNumber as phoneParser,
} from 'libphonenumber-js';

export function parsePhoneNumber(
  phone: string,
  countryCode: CountryCode
): PhoneNumber | undefined {
  try {
    return phoneParser(phone, countryCode);
  } catch {
    return undefined;
  }
}

export function isValidPhoneNumber(phone: PhoneNumber): boolean {
  return phone?.isValid();
}
