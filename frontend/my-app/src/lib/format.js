const FLAT_MAP = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
};

/**
 * Format a major key according to the user's accidental preference.
 * The stored value in the database is always the sharp spelling.
 * This function handles the display conversion.
 */
export function formatMajor(major, accidental = "sharp") {
  if (!major) return "TBA";
  if (accidental === "flat" && FLAT_MAP[major]) {
    return FLAT_MAP[major];
  }
  return major;
}

/**
 * For the form: pairs each stored value with its sharp and flat labels.
 * Non-accidental keys (C, D, E, F, G, A, B, TBA) have the same label
 * in both modes.
 */
export const MAJOR_OPTIONS = [
  { value: "TBA", sharp: "TBA", flat: "TBA" },
  { value: "C", sharp: "C", flat: "C" },
  { value: "C#", sharp: "C#", flat: "Db" },
  { value: "D", sharp: "D", flat: "D" },
  { value: "D#", sharp: "D#", flat: "Eb" },
  { value: "E", sharp: "E", flat: "E" },
  { value: "F", sharp: "F", flat: "F" },
  { value: "F#", sharp: "F#", flat: "Gb" },
  { value: "G", sharp: "G", flat: "G" },
  { value: "G#", sharp: "G#", flat: "Ab" },
  { value: "A", sharp: "A", flat: "A" },
  { value: "A#", sharp: "A#", flat: "Bb" },
  { value: "B", sharp: "B", flat: "B" },
];
