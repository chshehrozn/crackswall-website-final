// src/utils/common.js

export const decodeHtmlEntities = (encodedString) => {
  if (typeof window !== "undefined") {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(encodedString, "text/html")
      .body.textContent;
    return decodedString;
  } else {
    return encodedString; // Return the encoded string if on the server side
  }
};

export const formatToUTCPlus5 = (dateString) => {
  // Convert non-string inputs to a string
  if (dateString instanceof Date) {
    dateString = dateString.toISOString();
  }

  if (!dateString || typeof dateString !== "string") {
    throw new Error("Invalid input: Expected a date string");
  }

  // // Reformat and process the date string
  const formattedDateString = dateString.replace(" ", "T");
  const date = new Date(formattedDateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date or time format");
  }

  const offsetHours = 5; // UTC+5
  const offsetMinutes = 0; // no additional minutes
  const offsetSign = "+";

  const adjustedDate = new Date(
    date.getTime() + offsetHours * 60 * 60 * 1000 + offsetMinutes * 60 * 1000
  );

  const formattedDate = adjustedDate.toISOString().split(".")[0]; // Remove milliseconds
  const offsetString = `${offsetSign}${String(offsetHours).padStart(
    2,
    "0"
  )}:${String(offsetMinutes).padStart(2, "0")}`;

  return `${formattedDate}${offsetString}`;
};
