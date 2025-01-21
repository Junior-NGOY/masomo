/* type SponsorshipType = "UG" | "GV";

export function generateRegistrationNumber(
  schoolCode: string,
  sponsorshipType: SponsorshipType,
  year: number,
  sequence: number
): string {
  // Ensure the sequence is padded with leading zeros to always be 4 digits
  const paddedSequence = sequence.toString().padStart(4, "0");

  return `${schoolCode}/${sponsorshipType}/${year}/${paddedSequence}`;
}

// Keep track of the last used sequence number
let lastSequence = 0;

export function getNextRegistrationNumber(
  schoolCode: string = "BU",
  sponsorshipType: SponsorshipType = "UG",
  year: number = new Date().getFullYear()
): string {
  // Increment the sequence
  lastSequence++;

  return generateRegistrationNumber(
    schoolCode,
    sponsorshipType,
    year,
    lastSequence
  );
} */

/* interface RegNoOptions {
  schoolCode?: string;
  sponsorshipType: "PS" | "SS"; // Ps for private, SS for sponsored student
  //year?: number;
  sequence: number;
} */
export function generateRegistrationNumber(
  schoolCode: string,
  sponsorshipType: "PS" | "SS",
  sequence: number
): string {
  if (sequence < 1 || sequence > 9999) {
    throw new Error("Sequence number must be between 1 and 9999");
  }
  const year = new Date().getFullYear();
  const paddedSequence = sequence.toString().padStart(4, "0");
  const registrationNumber = `${schoolCode}/${sponsorshipType}/${year}/${paddedSequence}`;
  return registrationNumber;
}
