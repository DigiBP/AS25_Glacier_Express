// 1. INPUT PROCESSING & VALIDATION
// Ensure appt_date is defined (it's used later)
const date = appt_date || "";

// Read freebusy_response (object or string from the Make webhook)
let data = freebusy_response;

if (typeof data === "string") {
  try {
    data = JSON.parse(data);
  } catch (e) {
    data = {};
  }
} else if (typeof data !== "object" || data === null) {
  data = {};
}

// Busy intervals from data
let busy = Array.isArray(data.result) ? data.result : [];
busy_count_debug = busy.length;

// 2. TIME CONVERSION & SETUP
// Function to convert ISO time (e.g., "10:00:00.000+01:00") 
// to local "HH:MM"
function isoToHHMM(isoString) {
  // Finds the T separator and extracts the HH:MM part before the next colon
  const TIndex = isoString.indexOf('T');
  const endMarker = isoString.lastIndexOf(':'); // Find the colon before seconds/offset
  
  if (TIndex !== -1 && endMarker > TIndex) {
      // Extract HH:MM (e.g., "10:00" from "2025-12-15T10:00:00...")
      return isoString.substring(TIndex + 1, endMarker);
  }
  
  // Fallback (less reliable due to server timezone)
  const d = new Date(isoString);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

// Define busyRanges 
const busyRanges = busy.map(b => ({
  startTime: isoToHHMM(b.start),
  endTime:   isoToHHMM(b.end)
}));

// 3. SLOT GENERATION AND OVERLAP CHECK
// Function to check whether a candidate slot overlaps any busy interval
function isBusySlot(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const slotStart = h * 60 + m;
  const slotEnd   = slotStart + 30; // 30-minute slot

  return busyRanges.some(range => { 
    const [bh, bm] = range.startTime.split(":").map(Number);
    const [eh, em] = range.endTime.split(":").map(Number);
    const busyStart = bh * 60 + bm;
    const busyEnd   = eh * 60 + em;

    // Overlap logic: A slot is busy if slotStart < busyEnd && busyStart < slotEnd
    return slotStart < busyEnd && busyStart < slotEnd;
  });
}

// Generate 30-minute slots from 09:00 to 17:00
function pad(n) { return n < 10 ? "0" + n : "" + n; }

const candidateSlots = [];
for (let hour = 9; hour < 17; hour++) {
  for (let min = 0; min < 60; min += 30) {
    candidateSlots.push(`${pad(hour)}:${pad(min)}`);
  }
}

// Filter to free slots only
const availableHHMM = candidateSlots.filter(t => !isBusySlot(t));

// 4. OUTPUT 
// Turn "HH:MM" into full datetimes "YYYY-MM-DDTHH:MM:00"
const availableSlots = availableHHMM.map(t => `${date}T${t}:00`);

// Store results into Voiceflow variables
available_slots_pretty = availableHHMM.map(t => `• ${t}`).join("\n");