/**
 * Format a number to have exactly 2 decimal places
 * @param value - The number to format
 * @returns The formatted number with 2 decimal places
 */
export const formatToTwoDecimals = (
  value: number | undefined | null
): number => {
  if (value === undefined || value === null || isNaN(value)) {
    return 0;
  }
  return Math.round(value * 100) / 100;
};

/**
 * Format all numeric fields in timekeeping data to 2 decimal places
 */
export const formatTimekeepingNumbers = <T extends Record<string, any>>(
  data: T
): T => {
  if (!data || typeof data !== "object") {
    return data;
  }

  const formatted = { ...data };

  // Format direct numeric fields
  if (typeof formatted.totalWorkHour === "number") {
    formatted.totalWorkHour = formatToTwoDecimals(formatted.totalWorkHour);
  }
  if (typeof formatted.totalTimekeepingNumber === "number") {
    formatted.totalTimekeepingNumber = formatToTwoDecimals(
      formatted.totalTimekeepingNumber
    );
  }

  // Format shift information
  if (formatted.shiftInfor && typeof formatted.shiftInfor === "object") {
    if (typeof formatted.shiftInfor.shiftWorkHour === "number") {
      formatted.shiftInfor.shiftWorkHour = formatToTwoDecimals(
        formatted.shiftInfor.shiftWorkHour
      );
    }
    if (typeof formatted.shiftInfor.shiftTimekeepingNumber === "number") {
      formatted.shiftInfor.shiftTimekeepingNumber = formatToTwoDecimals(
        formatted.shiftInfor.shiftTimekeepingNumber
      );
    }
    if (typeof formatted.shiftInfor.totalWorkHour === "number") {
      formatted.shiftInfor.totalWorkHour = formatToTwoDecimals(
        formatted.shiftInfor.totalWorkHour
      );
    }
  }

  // Format OT information
  if (formatted.otInfor && typeof formatted.otInfor === "object") {
    if (typeof formatted.otInfor.otWorkHour === "number") {
      formatted.otInfor.otWorkHour = formatToTwoDecimals(
        formatted.otInfor.otWorkHour
      );
    }
    if (typeof formatted.otInfor.otTimekeepingNumber === "number") {
      formatted.otInfor.otTimekeepingNumber = formatToTwoDecimals(
        formatted.otInfor.otTimekeepingNumber
      );
    }
  }

  return formatted;
};

/**
 * Format all numeric fields in an array of timekeeping data
 */
export const formatTimekeepingArray = <T extends Record<string, any>>(
  data: T[]
): T[] => {
  if (!Array.isArray(data)) {
    return data;
  }
  return data.map((item) => formatTimekeepingNumbers(item));
};

/**
 * Format all numeric fields in salary data to 2 decimal places
 */
export const formatSalaryNumbers = <T extends Record<string, any>>(
  data: T
): T => {
  if (!data || typeof data !== "object") {
    return data;
  }

  const formatted = { ...data };

  // List of salary-related numeric fields
  const salaryFields = [
    "totalSalary",
    "grossSalary",
    "totalDailySalary",
    "totalOtSalary",
    "totalAllowance",
    "totalFine",
    "workSalary",
    "otSalary",
    "totalWorkHour",
    "totalWorkDay",
  ];

  // Format each salary field
  salaryFields.forEach((field) => {
    if (typeof formatted[field] === "number") {
      formatted[field] = formatToTwoDecimals(formatted[field]);
    }
  });

  return formatted;
};

/**
 * Format all numeric fields in an array of salary data
 */
export const formatSalaryArray = <T extends Record<string, any>>(
  data: T[]
): T[] => {
  if (!Array.isArray(data)) {
    return data;
  }
  return data.map((item) => formatSalaryNumbers(item));
};
